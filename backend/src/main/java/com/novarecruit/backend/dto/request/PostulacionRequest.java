package com.novarecruit.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PostulacionRequest {

    @NotNull(message = "El usuario postulante es obligatorio.")
    private Long usuarioId;

    @NotNull(message = "La vacante es obligatoria.")
    private Long vacanteId;

    @NotEmpty(message = "Debes declarar al menos una habilidad.")
    private List<@Valid PostulanteHabilidadRequest> habilidades;
}