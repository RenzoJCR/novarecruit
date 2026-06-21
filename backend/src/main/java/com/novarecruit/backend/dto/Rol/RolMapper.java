package com.novarecruit.backend.dto.Rol;

import com.novarecruit.backend.entity.Rol;
import org.springframework.stereotype.Component;

@Component
public class RolMapper {

    public RolResponse toResponse(Rol rol) {
        if (rol == null) {
            return null;
        }

        return RolResponse.builder()
                .id(rol.getId())
                .nombre(rol.getNombre())
                .descripcion(rol.getDescripcion())
                .createdAt(rol.getCreatedAt())
                .build();
    }

    public Rol toEntity(RolRequest request) {
        if (request == null) {
            return null;
        }

        return Rol.builder()
                .nombre(normalize(request.getNombre()))
                .descripcion(normalize(request.getDescripcion()))
                .build();
    }

    public void updateEntity(Rol rol, RolRequest request) {
        if (rol == null || request == null) {
            return;
        }

        rol.setNombre(normalize(request.getNombre()));
        rol.setDescripcion(normalize(request.getDescripcion()));
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String normalizedValue = value.trim();
        return normalizedValue.isEmpty() ? null : normalizedValue;
    }
}
