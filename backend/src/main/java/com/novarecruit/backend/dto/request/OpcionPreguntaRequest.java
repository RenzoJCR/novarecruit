package com.novarecruit.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OpcionPreguntaRequest {

    @NotBlank(message = "El texto de la opción es obligatorio.")
    @Size(max = 255, message = "La opción no debe superar los 255 caracteres.")
    private String texto;

    private Boolean esCorrecta;
}