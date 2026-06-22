package com.novarecruit.backend.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class RevisionTecnicaRequest {

    @NotNull(message = "Debes indicar si el postulante aprobó o fue rechazado.")
    private Boolean aprobado;

    @NotNull(message = "El puntaje obtenido es obligatorio.")
    @DecimalMin(value = "0.00", message = "El puntaje no puede ser negativo.")
    private BigDecimal puntajeObtenido;

    @Size(max = 1000, message = "El comentario técnico no debe superar los 1000 caracteres.")
    private String comentarioTecnico;
}