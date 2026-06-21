package com.novarecruit.backend.dto.PreguntaEvaluacion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PreguntaEvaluacionRequest {

    @NotNull(message = "La evaluación es obligatoria.")
    private Long evaluacionId;

    @NotBlank(message = "El tipo de pregunta es obligatorio.")
    @Pattern(regexp = "^(MULTIPLE|VERDADERO_FALSO|TEXTO|CODIGO)$", message = "El tipo de pregunta no es válido.")
    private String tipoPregunta;

    @NotBlank(message = "El enunciado es obligatorio.")
    private String enunciado;

    private String opcionA;
    private String opcionB;
    private String opcionC;
    private String opcionD;
    private String respuestaCorrecta;
}
