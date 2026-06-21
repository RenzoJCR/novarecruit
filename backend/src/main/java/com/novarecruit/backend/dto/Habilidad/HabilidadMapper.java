package com.novarecruit.backend.dto.Habilidad;

import com.novarecruit.backend.entity.Habilidad;
import org.springframework.stereotype.Component;

@Component
public class HabilidadMapper {

    public HabilidadResponse toResponse(Habilidad habilidad) {
        if (habilidad == null) {
            return null;
        }

        return HabilidadResponse.builder()
                .id(habilidad.getId())
                .nombre(habilidad.getNombre())
                .categoria(habilidad.getCategoria())
                .createdAt(habilidad.getCreatedAt())
                .build();
    }

    public Habilidad toEntity(HabilidadRequest request) {
        if (request == null) {
            return null;
        }

        return Habilidad.builder()
                .nombre(normalize(request.getNombre()))
                .categoria(normalize(request.getCategoria()))
                .build();
    }

    public void updateEntity(Habilidad habilidad, HabilidadRequest request) {
        if (habilidad == null || request == null) {
            return;
        }

        habilidad.setNombre(normalize(request.getNombre()));
        habilidad.setCategoria(normalize(request.getCategoria()));
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String normalizedValue = value.trim();
        return normalizedValue.isEmpty() ? null : normalizedValue;
    }
}
