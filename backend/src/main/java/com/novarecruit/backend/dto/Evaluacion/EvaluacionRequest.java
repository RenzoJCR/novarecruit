package com.novarecruit.backend.dto.Evaluacion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EvaluacionRequest {

    @NotNull(message = "La vacante es obligatoria.")
    private Long vacanteId;

    @NotBlank(message = "El título es obligatorio.")
    @Size(min = 3, max = 150, message = "El título debe tener entre 3 y 150 caracteres.")
    private String titulo;

    @Size(max = 2000, message = "La descripción no puede superar los 2000 caracteres.")
    private String descripcion;
}
