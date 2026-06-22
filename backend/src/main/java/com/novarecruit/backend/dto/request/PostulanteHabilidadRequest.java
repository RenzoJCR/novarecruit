package com.novarecruit.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostulanteHabilidadRequest {

    @NotNull(message = "La habilidad es obligatoria.")
    private Long habilidadId;

    @NotBlank(message = "El nivel del postulante es obligatorio.")
    private String nivelPostulante;

    @Min(value = 0, message = "Los años de experiencia no pueden ser negativos.")
    private Integer aniosExperiencia;
}