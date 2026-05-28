package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.request.AreaRequest;
import com.novarecruit.backend.dto.response.AreaResponse;
import com.novarecruit.backend.entity.Area;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.AreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AreaService {

    private final AreaRepository areaRepository;

    public List<AreaResponse> listarAreas() {
        return areaRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public AreaResponse obtenerAreaPorId(Long id) {
        Area area = buscarAreaPorId(id);
        return mapToResponse(area);
    }

    public AreaResponse crearArea(AreaRequest request) {
        String nombreNormalizado = request.getNombre().trim();

        if (areaRepository.existsByNombreIgnoreCase(nombreNormalizado)) {
            throw new BusinessException("Ya existe un área registrada con ese nombre.");
        }

        Area area = Area.builder()
                .nombre(nombreNormalizado)
                .descripcion(request.getDescripcion().trim())
                .estado(request.getEstado() != null ? request.getEstado() : true)
                .build();

        Area areaGuardada = areaRepository.save(area);

        return mapToResponse(areaGuardada);
    }

    public AreaResponse actualizarArea(Long id, AreaRequest request) {
        Area area = buscarAreaPorId(id);

        String nombreNormalizado = request.getNombre().trim();

        if (areaRepository.existsByNombreIgnoreCaseAndIdNot(nombreNormalizado, id)) {
            throw new BusinessException("Ya existe otra área registrada con ese nombre.");
        }

        area.setNombre(nombreNormalizado);
        area.setDescripcion(request.getDescripcion().trim());

        if (request.getEstado() != null) {
            area.setEstado(request.getEstado());
        }

        Area areaActualizada = areaRepository.save(area);

        return mapToResponse(areaActualizada);
    }

    public void eliminarArea(Long id) {
        Area area = buscarAreaPorId(id);

        area.setEstado(false);
        areaRepository.save(area);
    }

    private Area buscarAreaPorId(Long id) {
        return areaRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró el área solicitada."));
    }

    private AreaResponse mapToResponse(Area area) {
        return AreaResponse.builder()
                .id(area.getId())
                .nombre(area.getNombre())
                .descripcion(area.getDescripcion())
                .estado(area.getEstado())
                .fechaCreacion(area.getFechaCreacion())
                .build();
    }
}