package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.request.PostulacionRequest;
import com.novarecruit.backend.dto.request.PostulanteHabilidadRequest;
import com.novarecruit.backend.dto.request.RevisionRrhhRequest;
import com.novarecruit.backend.dto.response.PostulacionResponse;
import com.novarecruit.backend.dto.response.PostulanteHabilidadResponse;
import com.novarecruit.backend.entity.*;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.PostulacionRepository;
import com.novarecruit.backend.repository.PostulanteHabilidadRepository;
import com.novarecruit.backend.repository.UsuarioRepository;
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
public class PostulacionService {

    private static final Set<String> NIVELES_VALIDOS = Set.of("BASICO", "INTERMEDIO", "AVANZADO", "EXPERTO");

    private final PostulacionRepository postulacionRepository;
    private final PostulanteHabilidadRepository postulanteHabilidadRepository;
    private final UsuarioRepository usuarioRepository;
    private final VacanteRepository vacanteRepository;
    private final HabilidadService habilidadService;
    private final LogSistemaService logSistemaService;
    private final NotificacionService notificacionService;

    @Transactional(readOnly = true)
    public List<PostulacionResponse> listarPostulaciones() {
        return postulacionRepository.findAllByOrderByFechaPostulacionDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PostulacionResponse> listarPorVacante(Long vacanteId) {
        return postulacionRepository.findByVacante_IdOrderByFechaPostulacionDesc(vacanteId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PostulacionResponse> listarPorUsuario(Long usuarioId) {
        return postulacionRepository.findByUsuario_IdOrderByFechaPostulacionDesc(usuarioId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PostulacionResponse obtenerPorId(Long id) {
        return mapToResponse(buscarPostulacionPorId(id));
    }

    @Transactional
    public PostulacionResponse crearPostulacion(PostulacionRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new BusinessException("No se encontró el usuario postulante."));

        validarUsuarioPostulante(usuario);

        Vacante vacante = vacanteRepository.findById(request.getVacanteId())
                .orElseThrow(() -> new BusinessException("No se encontró la vacante seleccionada."));

        validarVacanteDisponible(vacante);

        if (postulacionRepository.existsByUsuario_IdAndVacante_Id(usuario.getId(), vacante.getId())) {
            throw new BusinessException("El postulante ya aplicó a esta vacante.");
        }

        Postulacion postulacion = Postulacion.builder()
                .usuario(usuario)
                .vacante(vacante)
                .estado("POSTULADO")
                .esGanador(false)
                .build();

        Postulacion postulacionGuardada = postulacionRepository.save(postulacion);

        guardarHabilidadesPostulante(postulacionGuardada, request.getHabilidades());

        logSistemaService.registrarLog(
                usuario.getId(),
                "POSTULAR",
                "POSTULACIONES",
                "El postulante " + usuario.getCorreo() + " aplicó a la vacante: " + vacante.getTitulo(),
                "127.0.0.1"
        );

        /*
         * Notificación para el postulante:
         * confirma que su postulación fue registrada.
         */
        notificacionService.crearNotificacion(
                usuario.getId(),
                "Postulación registrada",
                "Tu postulación a " + vacante.getTitulo() + " fue registrada correctamente.",
                "POSTULACION",
                "/applicant/postulaciones"
        );

        /*
         * Notificación para RRHH:
         * avisa en tiempo real al responsable de la vacante que llegó una nueva postulación.
         *
         * Esta era la parte que faltaba.
         * Como NotificacionService ya guarda en BD y emite por WebSocket,
         * RRHH verá el aviso sin recargar si tiene sesión abierta.
         */
        notificacionService.crearNotificacion(
                vacante.getRrhh().getId(),
                "Nueva postulación recibida",
                "El postulante " + usuario.getNombres() + " " + usuario.getApellidos()
                        + " aplicó a la vacante: " + vacante.getTitulo() + ".",
                "POSTULACION",
                "/rrhh/postulaciones"
        );

        return mapToResponse(postulacionGuardada);
    }

    @Transactional
    public PostulacionResponse revisarPorRrhh(Long id, RevisionRrhhRequest request) {
        Postulacion postulacion = buscarPostulacionPorId(id);

        if (!"POSTULADO".equals(postulacion.getEstado()) &&
                !"EN_REVISION_RRHH".equals(postulacion.getEstado())) {
            throw new BusinessException("Esta postulación no se encuentra en una etapa válida para revisión de RRHH.");
        }

        String nuevoEstado = Boolean.TRUE.equals(request.getAprobado())
                ? "APROBADO_RRHH"
                : "RECHAZADO_RRHH";

        postulacion.setEstado(nuevoEstado);
        postulacion.setComentarioRrhh(normalizarTextoOpcional(request.getComentarioRrhh()));

        Postulacion actualizada = postulacionRepository.save(postulacion);

        if ("APROBADO_RRHH".equals(nuevoEstado) && "ACTIVA".equals(postulacion.getVacante().getEstado())) {
            postulacion.getVacante().setEstado("EN_PROCESO");
            vacanteRepository.save(postulacion.getVacante());
        }

        logSistemaService.registrarLog(
                null,
                nuevoEstado,
                "POSTULACIONES",
                "RRHH revisó la postulación de " + postulacion.getUsuario().getCorreo()
                        + " para la vacante: " + postulacion.getVacante().getTitulo(),
                "127.0.0.1"
        );

        /*
         * Notificación para el postulante:
         * informa si pasó o no pasó la revisión de RRHH.
         */
        notificacionService.crearNotificacion(
                postulacion.getUsuario().getId(),
                "Resultado de revisión RRHH",
                Boolean.TRUE.equals(request.getAprobado())
                        ? "Tu postulación fue aprobada por RRHH y continuará a la etapa técnica."
                        : "Tu postulación no continuará en el proceso de selección.",
                "POSTULACION",
                "/applicant/postulaciones"
        );

        return mapToResponse(actualizada);
    }

    private void guardarHabilidadesPostulante(
            Postulacion postulacion,
            List<PostulanteHabilidadRequest> habilidadesRequest
    ) {
        Set<Long> habilidadesUsadas = new HashSet<>();

        for (PostulanteHabilidadRequest item : habilidadesRequest) {
            if (!habilidadesUsadas.add(item.getHabilidadId())) {
                throw new BusinessException("No puedes declarar la misma habilidad más de una vez.");
            }

            String nivel = normalizarTexto(item.getNivelPostulante()).toUpperCase();

            if (!NIVELES_VALIDOS.contains(nivel)) {
                throw new BusinessException("El nivel del postulante no es válido: " + nivel);
            }

            Habilidad habilidad = habilidadService.buscarHabilidadPorId(item.getHabilidadId());

            if (Boolean.FALSE.equals(habilidad.getEstado())) {
                throw new BusinessException("No puedes declarar una habilidad inactiva: " + habilidad.getNombre());
            }

            PostulanteHabilidad postulanteHabilidad = PostulanteHabilidad.builder()
                    .postulacion(postulacion)
                    .habilidad(habilidad)
                    .nivelPostulante(nivel)
                    .aniosExperiencia(item.getAniosExperiencia())
                    .build();

            postulanteHabilidadRepository.save(postulanteHabilidad);
        }
    }

    private void validarUsuarioPostulante(Usuario usuario) {
        if (Boolean.FALSE.equals(usuario.getEstado())) {
            throw new BusinessException("El usuario postulante se encuentra inactivo.");
        }

        if (!"POSTULANTE".equalsIgnoreCase(usuario.getRol().getNombre())) {
            throw new BusinessException("El usuario seleccionado no tiene rol de postulante.");
        }
    }

    private void validarVacanteDisponible(Vacante vacante) {
        if (!"ACTIVA".equals(vacante.getEstado()) && !"EN_PROCESO".equals(vacante.getEstado())) {
            throw new BusinessException("La vacante no se encuentra disponible para postular.");
        }

        if (vacante.getFechaCierre() != null && vacante.getFechaCierre().isBefore(LocalDate.now())) {
            throw new BusinessException("La fecha de postulación para esta vacante ya finalizó.");
        }
    }

    private Postulacion buscarPostulacionPorId(Long id) {
        return postulacionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la postulación solicitada."));
    }

    private PostulacionResponse mapToResponse(Postulacion postulacion) {
        List<PostulanteHabilidadResponse> habilidades = postulanteHabilidadRepository
                .findByPostulacion_Id(postulacion.getId())
                .stream()
                .map(this::mapHabilidadToResponse)
                .toList();

        Usuario usuario = postulacion.getUsuario();
        Vacante vacante = postulacion.getVacante();

        return PostulacionResponse.builder()
                .id(postulacion.getId())
                .usuarioId(usuario.getId())
                .postulanteNombre(usuario.getNombres() + " " + usuario.getApellidos())
                .postulanteCorreo(usuario.getCorreo())
                .vacanteId(vacante.getId())
                .vacanteTitulo(vacante.getTitulo())
                .areaNombre(vacante.getArea().getNombre())
                .estado(postulacion.getEstado())
                .fechaPostulacion(postulacion.getFechaPostulacion())
                .comentarioRrhh(postulacion.getComentarioRrhh())
                .comentarioTecnico(postulacion.getComentarioTecnico())
                .puntajeTecnico(postulacion.getPuntajeTecnico())
                .esGanador(postulacion.getEsGanador())
                .habilidades(habilidades)
                .build();
    }

    private PostulanteHabilidadResponse mapHabilidadToResponse(PostulanteHabilidad item) {
        return PostulanteHabilidadResponse.builder()
                .id(item.getId())
                .habilidadId(item.getHabilidad().getId())
                .habilidadNombre(item.getHabilidad().getNombre())
                .categoria(item.getHabilidad().getCategoria())
                .nivelPostulante(item.getNivelPostulante())
                .aniosExperiencia(item.getAniosExperiencia())
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