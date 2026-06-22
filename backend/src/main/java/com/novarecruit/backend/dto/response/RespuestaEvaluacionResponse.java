package com.novarecruit.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class RespuestaEvaluacionResponse {

    private Long id;
    private Long preguntaId;
    private String preguntaEnunciado;
    private Long opcionId;
    private String opcionTexto;
    private String respuestaTexto;
    private Boolean esCorrecta;
    private BigDecimal puntajeObtenido;
}