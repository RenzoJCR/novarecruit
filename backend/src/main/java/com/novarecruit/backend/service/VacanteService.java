package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.request.VacanteHabilidadRequest;
import com.novarecruit.backend.dto.request.VacanteRequest;
import com.novarecruit.backend.dto.response.VacanteHabilidadResponse;
import com.novarecruit.backend.dto.response.VacanteResponse;
import com.novarecruit.backend.entity.*;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.AreaRepository;
import com.novarecruit.backend.repository.UsuarioRepository;
import com.novarecruit.backend.repository.VacanteHabilidadRepository;
import com.novarecruit.backend.repository.VacanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class VacanteService {

    private static final Set<String> MODALIDADES_VALIDAS = Set.of("PRESENCIAL", "REMOTO", "HIBRIDO");
    private static final Set<String> NIVELES_VALIDOS = Set.of("BASICO", "INTERMEDIO", "AVANZADO", "EXPERTO");

    private final VacanteRepository vacanteRepository;
    private final VacanteHabilidadRepository vacanteHabilidadRepository;
    private final AreaRepository areaRepository;
    private final UsuarioRepository usuarioRepository;
    private final HabilidadService habilidadService;
    private final LogSistemaService logSistemaService;

    public List<VacanteResponse> listarVacantes() {
        return vacanteRepository.findAllByOrderByIdDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<VacanteResponse> listarVacantesActivas() {
        return vacanteRepository.findByEstadoOrderByFechaPublicacionDesc("ACTIVA")
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public VacanteResponse obtenerVacantePorId(Long id) {
        Vacante vacante = buscarVacantePorId(id);
        return mapToResponse(vacante);
    }

    @Transactional
    public VacanteResponse crearVacante(VacanteRequest request) {
        validarVacanteRequest(request);

        Area area = areaRepository.findById(request.getAreaId())
                .orElseThrow(() -> new BusinessException("No se encontró el área seleccionada."));

        if (Boolean.FALSE.equals(area.getEstado())) {
            throw new BusinessException("No se puede crear una vacante en un área inactiva.");
        }

        Usuario rrhh = usuarioRepository.findById(request.getRrhhId())
                .orElseThrow(() -> new BusinessException("No se encontró el usuario RRHH seleccionado."));

        validarUsuarioRRHH(rrhh);

        Vacante vacante = Vacante.builder()
                .titulo(normalizarTexto(request.getTitulo()))
                .descripcion(normalizarTexto(request.getDescripcion()))
                .modalidad(normalizarTexto(request.getModalidad()).toUpperCase())
                .ubicacion(normalizarTextoOpcional(request.getUbicacion()))
                .salario(request.getSalario())
                .nivelExperiencia(normalizarTexto(request.getNivelExperiencia()))
                .fechaCierre(request.getFechaCierre())
                .area(area)
                .rrhh(rrhh)
                .estado("ACTIVA")
                .build();

        Vacante vacanteGuardada = vacanteRepository.save(vacante);

        guardarHabilidadesVacante(vacanteGuardada, request.getHabilidades());

        logSistemaService.registrarLog(
                rrhh.getId(),
                "CREAR_VACANTE",
                "VACANTES",
                "RRHH creó la vacante: " + vacanteGuardada.getTitulo(),
                "127.0.0.1"
        );

        return mapToResponse(vacanteGuardada);
    }

    @Transactional
    public VacanteResponse actualizarVacante(Long id, VacanteRequest request) {
        validarVacanteRequest(request);

        Vacante vacante = buscarVacantePorId(id);

        Area area = areaRepository.findById(request.getAreaId())
                .orElseThrow(() -> new BusinessException("No se encontró el área seleccionada."));

        if (Boolean.FALSE.equals(area.getEstado())) {
            throw new BusinessException("No se puede asignar una vacante a un área inactiva.");
        }

        Usuario rrhh = usuarioRepository.findById(request.getRrhhId())
                .orElseThrow(() -> new BusinessException("No se encontró el usuario RRHH seleccionado."));

        validarUsuarioRRHH(rrhh);

        vacante.setTitulo(normalizarTexto(request.getTitulo()));
        vacante.setDescripcion(normalizarTexto(request.getDescripcion()));
        vacante.setModalidad(normalizarTexto(request.getModalidad()).toUpperCase());
        vacante.setUbicacion(normalizarTextoOpcional(request.getUbicacion()));
        vacante.setSalario(request.getSalario());
        vacante.setNivelExperiencia(normalizarTexto(request.getNivelExperiencia()));
        vacante.setFechaCierre(request.getFechaCierre());
        vacante.setArea(area);
        vacante.setRrhh(rrhh);

        Vacante vacanteActualizada = vacanteRepository.save(vacante);

        vacanteHabilidadRepository.deleteByVacanteId(id);
        guardarHabilidadesVacante(vacanteActualizada, request.getHabilidades());

        logSistemaService.registrarLog(
                rrhh.getId(),
                "ACTUALIZAR_VACANTE",
                "VACANTES",
                "RRHH actualizó la vacante: " + vacanteActualizada.getTitulo(),
                "127.0.0.1"
        );

        return mapToResponse(vacanteActualizada);
    }

    public void cancelarVacante(Long id) {
        Vacante vacante = buscarVacantePorId(id);

        if ("CERRADA".equals(vacante.getEstado())) {
            throw new BusinessException("No se puede cancelar una vacante que ya fue cerrada.");
        }

        if ("CANCELADA".equals(vacante.getEstado())) {
            throw new BusinessException("La vacante ya se encuentra cancelada.");
        }

        vacante.setEstado("CANCELADA");
        vacanteRepository.save(vacante);

        logSistemaService.registrarLog(
                vacante.getRrhh().getId(),
                "CANCELAR_VACANTE",
                "VACANTES",
                "Se canceló la vacante: " + vacante.getTitulo(),
                "127.0.0.1"
        );
    }

    private void guardarHabilidadesVacante(Vacante vacante, List<VacanteHabilidadRequest> habilidadesRequest) {
        Set<Long> habilidadesUsadas = new HashSet<>();

        for (VacanteHabilidadRequest item : habilidadesRequest) {
            if (!habilidadesUsadas.add(item.getHabilidadId())) {
                throw new BusinessException("No se puede repetir la misma habilidad dentro de una vacante.");
            }

            String nivel = normalizarTexto(item.getNivelRequerido()).toUpperCase();

            if (!NIVELES_VALIDOS.contains(nivel)) {
                throw new BusinessException("El nivel requerido no es válido: " + nivel);
            }

            Habilidad habilidad = habilidadService.buscarHabilidadPorId(item.getHabilidadId());

            if (Boolean.FALSE.equals(habilidad.getEstado())) {
                throw new BusinessException("No se puede usar una habilidad inactiva: " + habilidad.getNombre());
            }

            VacanteHabilidad vacanteHabilidad = VacanteHabilidad.builder()
                    .vacante(vacante)
                    .habilidad(habilidad)
                    .nivelRequerido(nivel)
                    .obligatorio(item.getObligatorio() != null ? item.getObligatorio() : true)
                    .build();

            vacanteHabilidadRepository.save(vacanteHabilidad);
        }
    }

    private void validarVacanteRequest(VacanteRequest request) {
        String modalidad = normalizarTexto(request.getModalidad()).toUpperCase();

        if (!MODALIDADES_VALIDAS.contains(modalidad)) {
            throw new BusinessException("La modalidad debe ser PRESENCIAL, REMOTO o HIBRIDO.");
        }

        if (request.getFechaCierre() != null && request.getFechaCierre().isBefore(LocalDate.now())) {
            throw new BusinessException("La fecha de cierre no puede ser anterior a la fecha actual.");
        }
    }

    private void validarUsuarioRRHH(Usuario usuario) {
        if (Boolean.FALSE.equals(usuario.getEstado())) {
            throw new BusinessException("El usuario RRHH seleccionado se encuentra inactivo.");
        }

        String rol = usuario.getRol().getNombre();

        if (!"RECURSOS_HUMANOS".equalsIgnoreCase(rol)) {
            throw new BusinessException("El usuario seleccionado no tiene rol de Recursos Humanos.");
        }
    }

    private Vacante buscarVacantePorId(Long id) {
        return vacanteRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la vacante solicitada."));
    }

    private VacanteResponse mapToResponse(Vacante vacante) {
        List<VacanteHabilidadResponse> habilidades = vacanteHabilidadRepository.findByVacanteId(vacante.getId())
                .stream()
                .map(this::mapHabilidadToResponse)
                .toList();

        return VacanteResponse.builder()
                .id(vacante.getId())
                .titulo(vacante.getTitulo())
                .descripcion(vacante.getDescripcion())
                .modalidad(vacante.getModalidad())
                .ubicacion(vacante.getUbicacion())
                .salario(vacante.getSalario())
                .nivelExperiencia(vacante.getNivelExperiencia())
                .estado(vacante.getEstado())
                .fechaPublicacion(vacante.getFechaPublicacion())
                .fechaCierre(vacante.getFechaCierre())
                .areaId(vacante.getArea().getId())
                .areaNombre(vacante.getArea().getNombre())
                .rrhhId(vacante.getRrhh().getId())
                .rrhhNombre(vacante.getRrhh().getNombres() + " " + vacante.getRrhh().getApellidos())
                .postulacionGanadoraId(vacante.getPostulacionGanadoraId())
                .habilidades(habilidades)
                .build();
    }

    private VacanteHabilidadResponse mapHabilidadToResponse(VacanteHabilidad vacanteHabilidad) {
        return VacanteHabilidadResponse.builder()
                .id(vacanteHabilidad.getId())
                .habilidadId(vacanteHabilidad.getHabilidad().getId())
                .habilidadNombre(vacanteHabilidad.getHabilidad().getNombre())
                .categoria(vacanteHabilidad.getHabilidad().getCategoria())
                .nivelRequerido(vacanteHabilidad.getNivelRequerido())
                .obligatorio(vacanteHabilidad.getObligatorio())
                .build();
    }

    private String normalizarTexto(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizarTextoOpcional(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}