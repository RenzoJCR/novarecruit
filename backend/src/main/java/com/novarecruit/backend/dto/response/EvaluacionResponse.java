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
public class EvaluacionResponse {

    private Long id;

    private Long vacanteId;
    private String vacanteTitulo;

    private Long tecnicoId;
    private String tecnicoNombre;

    private String titulo;
    private String descripcion;
    private Integer duracionMinutos;
    private BigDecimal puntajeMaximo;
    private String estado;
    private LocalDateTime createdAt;

    private List<PreguntaEvaluacionResponse> preguntas;
}