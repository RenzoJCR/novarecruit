package com.novarecruit.backend.dto.Habilidad;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HabilidadRequest {

    @NotBlank(message = "El nombre de la habilidad es obligatorio.")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres.")
    private String nombre;

    @Size(max = 100, message = "La categoría no puede superar los 100 caracteres.")
    private String categoria;
}
