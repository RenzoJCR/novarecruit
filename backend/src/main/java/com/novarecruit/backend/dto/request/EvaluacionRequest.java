package com.novarecruit.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class EvaluacionRequest {

    @NotNull(message = "La vacante es obligatoria.")
    private Long vacanteId;

    @NotNull(message = "El líder técnico es obligatorio.")
    private Long tecnicoId;

    @NotBlank(message = "El título de la evaluación es obligatorio.")
    @Size(min = 5, max = 150, message = "El título debe tener entre 5 y 150 caracteres.")
    private String titulo;

    @Size(max = 1000, message = "La descripción no debe superar los 1000 caracteres.")
    private String descripcion;

    @NotNull(message = "La duración es obligatoria.")
    @Min(value = 1, message = "La duración debe ser mayor a cero.")
    private Integer duracionMinutos;

    @NotNull(message = "El puntaje máximo es obligatorio.")
    @DecimalMin(value = "0.01", message = "El puntaje máximo debe ser mayor a cero.")
    private BigDecimal puntajeMaximo;

    @NotEmpty(message = "La evaluación debe tener al menos una pregunta.")
    private List<@Valid PreguntaEvaluacionRequest> preguntas;
}