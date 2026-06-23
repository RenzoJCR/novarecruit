package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.request.AreaRequest;
import com.novarecruit.backend.dto.response.AreaResponse;
import com.novarecruit.backend.entity.Area;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.AreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AreaService {

    private final AreaRepository areaRepository;
    private final LogSistemaService logSistemaService;

    @Transactional(readOnly = true)
    public List<AreaResponse> listarAreas() {
        return areaRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AreaResponse> listarAreasActivas() {
        return areaRepository.findByEstadoTrueOrderByNombreAsc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AreaResponse obtenerAreaPorId(Long id) {
        Area area = buscarAreaPorId(id);
        return mapToResponse(area);
    }

    @Transactional
    public AreaResponse crearArea(AreaRequest request) {
        String nombreNormalizado = normalizarTexto(request.getNombre());
        String descripcionNormalizada = normalizarTexto(request.getDescripcion());

        if (areaRepository.existsByNombreIgnoreCase(nombreNormalizado)) {
            throw new BusinessException("Ya existe un área registrada con ese nombre.");
        }

        Area area = Area.builder()
                .nombre(nombreNormalizado)
                .descripcion(descripcionNormalizada)
                .estado(request.getEstado() != null ? request.getEstado() : true)
                .build();

        Area areaGuardada = areaRepository.save(area);

        logSistemaService.registrarLog(
                null,
                "CREAR_AREA",
                "AREAS",
                "Se creó el área: " + areaGuardada.getNombre(),
                "127.0.0.1"
        );

        return mapToResponse(areaGuardada);
    }

    @Transactional
    public AreaResponse actualizarArea(Long id, AreaRequest request) {
        Area area = buscarAreaPorId(id);

        String nombreNormalizado = normalizarTexto(request.getNombre());
        String descripcionNormalizada = normalizarTexto(request.getDescripcion());

        if (areaRepository.existsByNombreIgnoreCaseAndIdNot(nombreNormalizado, id)) {
            throw new BusinessException("Ya existe otra área registrada con ese nombre.");
        }

        area.setNombre(nombreNormalizado);
        area.setDescripcion(descripcionNormalizada);

        if (request.getEstado() != null) {
            area.setEstado(request.getEstado());
        }

        Area areaActualizada = areaRepository.save(area);

        logSistemaService.registrarLog(
                null,
                "ACTUALIZAR_AREA",
                "AREAS",
                "Se actualizó el área: " + areaActualizada.getNombre(),
                "127.0.0.1"
        );

        return mapToResponse(areaActualizada);
    }

    @Transactional
    public void desactivarArea(Long id) {
        Area area = buscarAreaPorId(id);

        if (Boolean.FALSE.equals(area.getEstado())) {
            throw new BusinessException("El área ya se encuentra desactivada.");
        }

        area.setEstado(false);
        areaRepository.save(area);

        logSistemaService.registrarLog(
                null,
                "DESACTIVAR_AREA",
                "AREAS",
                "Se desactivó el área: " + area.getNombre(),
                "127.0.0.1"
        );
    }

    @Transactional
    public AreaResponse reactivarArea(Long id) {
        Area area = buscarAreaPorId(id);

        if (Boolean.TRUE.equals(area.getEstado())) {
            throw new BusinessException("El área ya se encuentra activa.");
        }

        area.setEstado(true);

        Area areaActualizada = areaRepository.save(area);

        logSistemaService.registrarLog(
                null,
                "REACTIVAR_AREA",
                "AREAS",
                "Se reactivó el área: " + areaActualizada.getNombre(),
                "127.0.0.1"
        );

        return mapToResponse(areaActualizada);
    }

    private Area buscarAreaPorId(Long id) {
        return areaRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró el área solicitada."));
    }

    private String normalizarTexto(String value) {
        return value == null ? null : value.trim();
    }

    private AreaResponse mapToResponse(Area area) {
        return AreaResponse.builder()
                .id(area.getId())
                .nombre(area.getNombre())
                .descripcion(area.getDescripcion())
                .estado(area.getEstado())
                .createdAt(area.getCreatedAt())
                .build();
    }
}