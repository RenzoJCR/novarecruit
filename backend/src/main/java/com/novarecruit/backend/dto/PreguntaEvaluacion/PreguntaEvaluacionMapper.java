package com.novarecruit.backend.dto.PreguntaEvaluacion;

import com.novarecruit.backend.entity.PreguntaEvaluacion;
import org.springframework.stereotype.Component;

@Component
public class PreguntaEvaluacionMapper {

    public PreguntaEvaluacionResponse toResponse(PreguntaEvaluacion entity) {
        if (entity == null) {
            return null;
        }

        return PreguntaEvaluacionResponse.builder()
                .id(entity.getId())
                .evaluacionId(entity.getEvaluacion() != null ? entity.getEvaluacion().getId() : null)
                .evaluacionTitulo(entity.getEvaluacion() != null ? entity.getEvaluacion().getTitulo() : null)
                .tipoPregunta(entity.getTipoPregunta())
                .enunciado(entity.getEnunciado())
                .opcionA(entity.getOpcionA())
                .opcionB(entity.getOpcionB())
                .opcionC(entity.getOpcionC())
                .opcionD(entity.getOpcionD())
                .respuestaCorrecta(entity.getRespuestaCorrecta())
                .build();
    }

    public PreguntaEvaluacion toEntity(PreguntaEvaluacionRequest request) {
        if (request == null) {
            return null;
        }

        return PreguntaEvaluacion.builder()
                .tipoPregunta(normalizeUpper(request.getTipoPregunta()))
                .enunciado(normalize(request.getEnunciado()))
                .opcionA(normalize(request.getOpcionA()))
                .opcionB(normalize(request.getOpcionB()))
                .opcionC(normalize(request.getOpcionC()))
                .opcionD(normalize(request.getOpcionD()))
                .respuestaCorrecta(normalize(request.getRespuestaCorrecta()))
                .build();
    }

    public void updateEntity(PreguntaEvaluacion entity, PreguntaEvaluacionRequest request) {
        if (entity == null || request == null) {
            return;
        }

        entity.setTipoPregunta(normalizeUpper(request.getTipoPregunta()));
        entity.setEnunciado(normalize(request.getEnunciado()));
        entity.setOpcionA(normalize(request.getOpcionA()));
        entity.setOpcionB(normalize(request.getOpcionB()));
        entity.setOpcionC(normalize(request.getOpcionC()));
        entity.setOpcionD(normalize(request.getOpcionD()));
        entity.setRespuestaCorrecta(normalize(request.getRespuestaCorrecta()));
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String normalizedValue = value.trim();
        return normalizedValue.isEmpty() ? null : normalizedValue;
    }

    private String normalizeUpper(String value) {
        String normalizedValue = normalize(value);
        return normalizedValue != null ? normalizedValue.toUpperCase() : null;
    }
}
