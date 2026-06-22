package com.novarecruit.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EnviarEvaluacionRequest {

    @NotNull(message = "La evaluación asignada es obligatoria.")
    private Long evaluacionPostulacionId;

    @NotEmpty(message = "Debes enviar al menos una respuesta.")
    private List<@Valid RespuestaPreguntaRequest> respuestas;
}