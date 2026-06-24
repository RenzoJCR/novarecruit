package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.request.HabilidadRequest;
import com.novarecruit.backend.dto.response.HabilidadResponse;
import com.novarecruit.backend.entity.Habilidad;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.HabilidadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HabilidadService {

    private final HabilidadRepository habilidadRepository;
    private final LogSistemaService logSistemaService;
    private final AdminNotificationService adminNotificationService;

    @Transactional(readOnly = true)
    public List<HabilidadResponse> listarHabilidades() {
        return habilidadRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HabilidadResponse> listarHabilidadesActivas() {
        return habilidadRepository.findByEstadoTrueOrderByNombreAsc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public HabilidadResponse obtenerPorId(Long id) {
        Habilidad habilidad = buscarHabilidadPorId(id);
        return mapToResponse(habilidad);
    }

    @Transactional
    public HabilidadResponse crearHabilidad(HabilidadRequest request) {
        String nombreNormalizado = normalizarTexto(request.getNombre());
        String categoriaNormalizada = normalizarTexto(request.getCategoria());

        if (habilidadRepository.existsByNombreIgnoreCase(nombreNormalizado)) {
            throw new BusinessException("Ya existe una habilidad registrada con ese nombre.");
        }

        Habilidad habilidad = Habilidad.builder()
                .nombre(nombreNormalizado)
                .categoria(categoriaNormalizada)
                .estado(request.getEstado() != null ? request.getEstado() : true)
                .build();

        Habilidad habilidadGuardada = habilidadRepository.save(habilidad);

        logSistemaService.registrarLog(
                null,
                "CREAR_HABILIDAD",
                "HABILIDADES",
                "Se creó la habilidad: " + habilidadGuardada.getNombre(),
                "127.0.0.1"
        );

        adminNotificationService.notificarAdministradores(
                "Habilidad creada",
                "Se creó la habilidad " + habilidadGuardada.getNombre() + ".",
                "SISTEMA",
                "/admin/habilidades"
        );

        return mapToResponse(habilidadGuardada);
    }

    @Transactional
    public HabilidadResponse actualizarHabilidad(Long id, HabilidadRequest request) {
        Habilidad habilidad = buscarHabilidadPorId(id);

        String nombreNormalizado = normalizarTexto(request.getNombre());
        String categoriaNormalizada = normalizarTexto(request.getCategoria());

        if (habilidadRepository.existsByNombreIgnoreCaseAndIdNot(nombreNormalizado, id)) {
            throw new BusinessException("Ya existe otra habilidad registrada con ese nombre.");
        }

        habilidad.setNombre(nombreNormalizado);
        habilidad.setCategoria(categoriaNormalizada);

        if (request.getEstado() != null) {
            habilidad.setEstado(request.getEstado());
        }

        Habilidad habilidadActualizada = habilidadRepository.save(habilidad);

        logSistemaService.registrarLog(
                null,
                "ACTUALIZAR_HABILIDAD",
                "HABILIDADES",
                "Se actualizó la habilidad: " + habilidadActualizada.getNombre(),
                "127.0.0.1"
        );

        adminNotificationService.notificarAdministradores(
                "Habilidad actualizada",
                "Se actualizó la habilidad " + habilidadActualizada.getNombre() + ".",
                "SISTEMA",
                "/admin/habilidades"
        );

        return mapToResponse(habilidadActualizada);
    }

    @Transactional
    public void desactivarHabilidad(Long id) {
        Habilidad habilidad = buscarHabilidadPorId(id);

        if (Boolean.FALSE.equals(habilidad.getEstado())) {
            throw new BusinessException("La habilidad ya se encuentra desactivada.");
        }

        habilidad.setEstado(false);
        habilidadRepository.save(habilidad);

        logSistemaService.registrarLog(
                null,
                "DESACTIVAR_HABILIDAD",
                "HABILIDADES",
                "Se desactivó la habilidad: " + habilidad.getNombre(),
                "127.0.0.1"
        );

        adminNotificationService.notificarAdministradores(
                "Habilidad desactivada",
                "Se desactivó la habilidad " + habilidad.getNombre() + ".",
                "SISTEMA",
                "/admin/habilidades"
        );
    }

    @Transactional
    public HabilidadResponse reactivarHabilidad(Long id) {
        Habilidad habilidad = buscarHabilidadPorId(id);

        if (Boolean.TRUE.equals(habilidad.getEstado())) {
            throw new BusinessException("La habilidad ya se encuentra activa.");
        }

        habilidad.setEstado(true);

        Habilidad habilidadActualizada = habilidadRepository.save(habilidad);

        logSistemaService.registrarLog(
                null,
                "REACTIVAR_HABILIDAD",
                "HABILIDADES",
                "Se reactivó la habilidad: " + habilidadActualizada.getNombre(),
                "127.0.0.1"
        );

        adminNotificationService.notificarAdministradores(
                "Habilidad reactivada",
                "Se reactivó la habilidad " + habilidadActualizada.getNombre() + ".",
                "SISTEMA",
                "/admin/habilidades"
        );

        return mapToResponse(habilidadActualizada);
    }

    /*
     * Este método lo usan otros servicios, por ejemplo vacantes y postulaciones,
     * para validar habilidades existentes.
     */
    public Habilidad buscarHabilidadPorId(Long id) {
        return habilidadRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la habilidad solicitada."));
    }

    private String normalizarTexto(String value) {
        return value == null ? null : value.trim();
    }

    private HabilidadResponse mapToResponse(Habilidad habilidad) {
        return HabilidadResponse.builder()
                .id(habilidad.getId())
                .nombre(habilidad.getNombre())
                .categoria(habilidad.getCategoria())
                .estado(habilidad.getEstado())
                .createdAt(habilidad.getCreatedAt())
                .build();
    }
}