package com.novarecruit.backend.dto.PreguntaEvaluacion;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PreguntaEvaluacionResponse {

    private Long id;
    private Long evaluacionId;
    private String evaluacionTitulo;
    private String tipoPregunta;
    private String enunciado;
    private String opcionA;
    private String opcionB;
    private String opcionC;
    private String opcionD;
    private String respuestaCorrecta;
}
