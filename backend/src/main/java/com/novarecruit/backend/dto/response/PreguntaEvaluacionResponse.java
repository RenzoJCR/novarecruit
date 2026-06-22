package com.novarecruit.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class PreguntaEvaluacionResponse {

    private Long id;
    private String tipoPregunta;
    private String enunciado;
    private BigDecimal puntaje;
    private Integer orden;
    private List<OpcionPreguntaResponse> opciones;
}