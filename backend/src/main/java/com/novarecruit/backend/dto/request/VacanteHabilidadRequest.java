package com.novarecruit.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VacanteHabilidadRequest {

    @NotNull(message = "La habilidad es obligatoria.")
    private Long habilidadId;

    @NotBlank(message = "El nivel requerido es obligatorio.")
    private String nivelRequerido;

    private Boolean obligatorio;
}