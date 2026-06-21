package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.Rol.RolMapper;
import com.novarecruit.backend.dto.Rol.RolRequest;
import com.novarecruit.backend.dto.Rol.RolResponse;
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
    private final RolMapper rolMapper;

    public List<RolResponse> listarRoles() {
        return rolRepository.findAll()
                .stream()
                .map(rolMapper::toResponse)
                .toList();
    }

    public RolResponse obtenerRolPorId(Long id) {
        return rolMapper.toResponse(buscarRolPorId(id));
    }

    public RolResponse crearRol(RolRequest request) {
        String nombre = normalizarNombre(request.getNombre());

        if (rolRepository.existsByNombreIgnoreCase(nombre)) {
            throw new BusinessException("Ya existe un rol con ese nombre.");
        }

        Rol rol = rolMapper.toEntity(request);
        return rolMapper.toResponse(rolRepository.save(rol));
    }

    public RolResponse actualizarRol(Long id, RolRequest request) {
        Rol rol = buscarRolPorId(id);
        String nombre = normalizarNombre(request.getNombre());

        if (rolRepository.existsByNombreIgnoreCaseAndIdNot(nombre, id)) {
            throw new BusinessException("Ya existe otro rol con ese nombre.");
        }

        rolMapper.updateEntity(rol, request);
        return rolMapper.toResponse(rolRepository.save(rol));
    }

    private Rol buscarRolPorId(Long id) {
        return rolRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró el rol solicitado."));
    }

    private String normalizarNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new BusinessException("El nombre del rol es obligatorio.");
        }

        return nombre.trim();
    }
}
