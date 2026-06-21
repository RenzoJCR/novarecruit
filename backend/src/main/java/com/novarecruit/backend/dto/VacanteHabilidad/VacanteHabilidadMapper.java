package com.novarecruit.backend.dto.VacanteHabilidad;

import com.novarecruit.backend.entity.VacanteHabilidad;
import org.springframework.stereotype.Component;

@Component
public class VacanteHabilidadMapper {

    public VacanteHabilidadResponse toResponse(VacanteHabilidad entity) {
        if (entity == null) {
            return null;
        }

        return VacanteHabilidadResponse.builder()
                .id(entity.getId())
                .vacanteId(entity.getVacante() != null ? entity.getVacante().getId() : null)
                .vacanteTitulo(entity.getVacante() != null ? entity.getVacante().getTitulo() : null)
                .habilidadId(entity.getHabilidad() != null ? entity.getHabilidad().getId() : null)
                .habilidadNombre(entity.getHabilidad() != null ? entity.getHabilidad().getNombre() : null)
                .nivelRequerido(entity.getNivelRequerido())
                .build();
    }

    public VacanteHabilidad toEntity(VacanteHabilidadRequest request) {
        if (request == null) {
            return null;
        }

        return VacanteHabilidad.builder()
                .nivelRequerido(normalize(request.getNivelRequerido()))
                .build();
    }

    public void updateEntity(VacanteHabilidad entity, VacanteHabilidadRequest request) {
        if (entity == null || request == null) {
            return;
        }

        entity.setNivelRequerido(normalize(request.getNivelRequerido()));
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String normalizedValue = value.trim();
        return normalizedValue.isEmpty() ? null : normalizedValue.toUpperCase();
    }
}
