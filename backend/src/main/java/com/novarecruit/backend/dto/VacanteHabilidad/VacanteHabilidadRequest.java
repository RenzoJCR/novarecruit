package com.novarecruit.backend.dto.VacanteHabilidad;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VacanteHabilidadRequest {

    @NotNull(message = "La vacante es obligatoria.")
    private Long vacanteId;

    @NotNull(message = "La habilidad es obligatoria.")
    private Long habilidadId;

    @NotBlank(message = "El nivel requerido es obligatorio.")
    @Pattern(regexp = "^(BASICO|INTERMEDIO|AVANZADO|EXPERTO)$", message = "El nivel requerido debe ser BASICO, INTERMEDIO, AVANZADO o EXPERTO.")
    private String nivelRequerido;
}
