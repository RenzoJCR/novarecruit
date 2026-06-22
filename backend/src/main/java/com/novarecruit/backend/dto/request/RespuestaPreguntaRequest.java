package com.novarecruit.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RespuestaPreguntaRequest {

    @NotNull(message = "La pregunta es obligatoria.")
    private Long preguntaId;

    private Long opcionId;

    private String respuestaTexto;
}