package com.novarecruit.backend.dto.PostulanteHabilidad;

import com.novarecruit.backend.entity.PostulanteHabilidad;
import org.springframework.stereotype.Component;

@Component
public class PostulanteHabilidadMapper {

    public PostulanteHabilidadResponse toResponse(PostulanteHabilidad entity) {
        if (entity == null) {
            return null;
        }

        return PostulanteHabilidadResponse.builder()
                .id(entity.getId())
                .postulacionId(entity.getPostulacion() != null ? entity.getPostulacion().getId() : null)
                .postulacionEstado(entity.getPostulacion() != null ? entity.getPostulacion().getEstado() : null)
                .habilidadId(entity.getHabilidad() != null ? entity.getHabilidad().getId() : null)
                .habilidadNombre(entity.getHabilidad() != null ? entity.getHabilidad().getNombre() : null)
                .nivelPostulante(entity.getNivelPostulante())
                .aniosExperiencia(entity.getAniosExperiencia())
                .build();
    }

    public PostulanteHabilidad toEntity(PostulanteHabilidadRequest request) {
        if (request == null) {
            return null;
        }

        return PostulanteHabilidad.builder()
                .nivelPostulante(normalizeUpper(request.getNivelPostulante()))
                .aniosExperiencia(request.getAniosExperiencia())
                .build();
    }

    public void updateEntity(PostulanteHabilidad entity, PostulanteHabilidadRequest request) {
        if (entity == null || request == null) {
            return;
        }

        entity.setNivelPostulante(normalizeUpper(request.getNivelPostulante()));
        entity.setAniosExperiencia(request.getAniosExperiencia());
    }

    private String normalizeUpper(String value) {
        if (value == null) {
            return null;
        }

        String normalizedValue = value.trim();
        return normalizedValue.isEmpty() ? null : normalizedValue.toUpperCase();
    }
}
