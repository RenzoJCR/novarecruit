package com.novarecruit.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AsignarEvaluacionRequest {

    @NotNull(message = "La postulación es obligatoria.")
    private Long postulacionId;

    @NotNull(message = "La evaluación es obligatoria.")
    private Long evaluacionId;
}