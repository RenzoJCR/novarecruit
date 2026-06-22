package com.novarecruit.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class EvaluacionPostulacionResponse {

    private Long id;

    private Long postulacionId;
    private String postulacionEstado;
    private Boolean esGanador;

    private Long evaluacionId;
    private String evaluacionTitulo;

    private Long vacanteId;
    private String vacanteTitulo;

    private Long postulanteId;
    private String postulanteNombre;
    private String postulanteCorreo;

    private String estado;
    private LocalDateTime fechaAsignacion;
    private LocalDateTime fechaEnvio;
    private BigDecimal puntajeObtenido;
    private String comentarioTecnico;

    private List<RespuestaEvaluacionResponse> respuestas;
}