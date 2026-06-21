package com.novarecruit.backend.dto.Evaluacion;

import com.novarecruit.backend.entity.Evaluacion;
import org.springframework.stereotype.Component;

@Component
public class EvaluacionMapper {

    public EvaluacionResponse toResponse(Evaluacion evaluacion) {
        if (evaluacion == null) {
            return null;
        }

        return EvaluacionResponse.builder()
                .id(evaluacion.getId())
                .vacanteId(evaluacion.getVacante() != null ? evaluacion.getVacante().getId() : null)
                .vacanteTitulo(evaluacion.getVacante() != null ? evaluacion.getVacante().getTitulo() : null)
                .titulo(evaluacion.getTitulo())
                .descripcion(evaluacion.getDescripcion())
                .createdAt(evaluacion.getCreatedAt())
                .build();
    }

    public Evaluacion toEntity(EvaluacionRequest request) {
        if (request == null) {
            return null;
        }

        return Evaluacion.builder()
                .titulo(normalize(request.getTitulo()))
                .descripcion(normalize(request.getDescripcion()))
                .build();
    }

    public void updateEntity(Evaluacion evaluacion, EvaluacionRequest request) {
        if (evaluacion == null || request == null) {
            return;
        }

        evaluacion.setTitulo(normalize(request.getTitulo()));
        evaluacion.setDescripcion(normalize(request.getDescripcion()));
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String normalizedValue = value.trim();
        return normalizedValue.isEmpty() ? null : normalizedValue;
    }
}
