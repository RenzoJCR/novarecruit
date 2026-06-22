package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.response.RolResponse;
import com.novarecruit.backend.entity.Rol;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RolService {

    private final RolRepository rolRepository;

    public List<RolResponse> listarRoles() {
        return rolRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<RolResponse> listarRolesActivos() {
        return rolRepository.findByEstadoTrueOrderByNombreAsc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Rol buscarRolPorId(Long id) {
        return rolRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró el rol solicitado."));
    }

    private RolResponse mapToResponse(Rol rol) {
        return RolResponse.builder()
                .id(rol.getId())
                .nombre(rol.getNombre())
                .descripcion(rol.getDescripcion())
                .estado(rol.getEstado())
                .createdAt(rol.getCreatedAt())
                .build();
    }
}