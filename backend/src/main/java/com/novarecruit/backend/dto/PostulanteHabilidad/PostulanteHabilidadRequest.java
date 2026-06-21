package com.novarecruit.backend.dto.PostulanteHabilidad;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostulanteHabilidadRequest {

    @NotNull(message = "La postulación es obligatoria.")
    private Long postulacionId;

    @NotNull(message = "La habilidad es obligatoria.")
    private Long habilidadId;

    @NotBlank(message = "El nivel del postulante es obligatorio.")
    @Pattern(regexp = "^(BASICO|INTERMEDIO|AVANZADO|EXPERTO)$", message = "El nivel del postulante debe ser BASICO, INTERMEDIO, AVANZADO o EXPERTO.")
    private String nivelPostulante;

    @Min(value = 0, message = "Los años de experiencia no pueden ser negativos.")
    private Integer aniosExperiencia;
}
