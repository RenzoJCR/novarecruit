package com.novarecruit.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class PreguntaEvaluacionRequest {

    @NotBlank(message = "El tipo de pregunta es obligatorio.")
    private String tipoPregunta;

    @NotBlank(message = "El enunciado de la pregunta es obligatorio.")
    private String enunciado;

    @NotNull(message = "El puntaje de la pregunta es obligatorio.")
    @DecimalMin(value = "0.01", message = "El puntaje debe ser mayor a cero.")
    private BigDecimal puntaje;

    @NotNull(message = "El orden de la pregunta es obligatorio.")
    @Min(value = 1, message = "El orden debe ser mayor a cero.")
    private Integer orden;

    private List<@Valid OpcionPreguntaRequest> opciones;
}