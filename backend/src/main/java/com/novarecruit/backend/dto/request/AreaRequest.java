package com.novarecruit.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AreaRequest {

    @NotBlank(message = "El nombre del área es obligatorio.")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres.")
    private String nombre;

    @NotBlank(message = "La descripción del área es obligatoria.")
    @Size(min = 10, max = 255, message = "La descripción debe tener entre 10 y 255 caracteres.")
    private String descripcion;

    private Boolean estado;
}