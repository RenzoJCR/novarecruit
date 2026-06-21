package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.Habilidad.HabilidadMapper;
import com.novarecruit.backend.dto.Habilidad.HabilidadRequest;
import com.novarecruit.backend.dto.Habilidad.HabilidadResponse;
import com.novarecruit.backend.entity.Habilidad;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.HabilidadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HabilidadService {

    private final HabilidadRepository habilidadRepository;
    private final HabilidadMapper habilidadMapper;

    public List<HabilidadResponse> listarHabilidades() {
        return habilidadRepository.findAll()
                .stream()
                .map(habilidadMapper::toResponse)
                .toList();
    }

    public HabilidadResponse obtenerHabilidadPorId(Long id) {
        return habilidadMapper.toResponse(buscarHabilidadPorId(id));
    }

    public HabilidadResponse crearHabilidad(HabilidadRequest request) {
        String nombre = normalizarNombre(request.getNombre());

        if (habilidadRepository.existsByNombreIgnoreCase(nombre)) {
            throw new BusinessException("Ya existe una habilidad con ese nombre.");
        }

        Habilidad habilidad = habilidadMapper.toEntity(request);
        return habilidadMapper.toResponse(habilidadRepository.save(habilidad));
    }

    public HabilidadResponse actualizarHabilidad(Long id, HabilidadRequest request) {
        Habilidad habilidad = buscarHabilidadPorId(id);
        String nombre = normalizarNombre(request.getNombre());

        if (habilidadRepository.existsByNombreIgnoreCaseAndIdNot(nombre, id)) {
            throw new BusinessException("Ya existe otra habilidad con ese nombre.");
        }

        habilidadMapper.updateEntity(habilidad, request);
        return habilidadMapper.toResponse(habilidadRepository.save(habilidad));
    }

    private Habilidad buscarHabilidadPorId(Long id) {
        return habilidadRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la habilidad solicitada."));
    }

    private String normalizarNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new BusinessException("El nombre de la habilidad es obligatorio.");
        }

        return nombre.trim();
    }
}
