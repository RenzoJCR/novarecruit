package com.novarecruit.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.novarecruit.backend.dto.Area.AreaMapper;
import com.novarecruit.backend.dto.Area.AreaRequest;
import com.novarecruit.backend.dto.Area.AreaResponse;
import com.novarecruit.backend.entity.Area;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.AreaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AreaService {

    private final AreaRepository areaRepository;
    private final AreaMapper areaMapper;

    public List<AreaResponse> listarAreas() {
        return areaRepository.findAll()
                .stream()
                .map(areaMapper::toResponse)
                .toList();
    }

    public AreaResponse obtenerAreaPorId(Long id) {
        Area area = buscarAreaPorId(id);
        return areaMapper.toResponse(area);
    }

    public AreaResponse crearArea(AreaRequest request) {
        String nombreNormalizado = request.getNombre().trim();

        if (areaRepository.existsByNombreIgnoreCase(nombreNormalizado)) {
            throw new BusinessException("Ya existe un área registrada con ese nombre.");
        }

        Area area = areaMapper.toEntity(request);

        Area areaGuardada = areaRepository.save(area);

        return areaMapper.toResponse(areaGuardada);
    }

    public AreaResponse actualizarArea(Long id, AreaRequest request) {
        Area area = buscarAreaPorId(id);

        String nombreNormalizado = request.getNombre().trim();

        if (areaRepository.existsByNombreIgnoreCaseAndIdNot(nombreNormalizado, id)) {
            throw new BusinessException("Ya existe otra área registrada con ese nombre.");
        }

        areaMapper.updateEntity(area, request);

        Area areaActualizada = areaRepository.save(area);

        return areaMapper.toResponse(areaActualizada);
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
}