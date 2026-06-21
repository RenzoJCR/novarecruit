package com.novarecruit.backend.dto.Evaluacion;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class EvaluacionResponse {

    private Long id;
    private Long vacanteId;
    private String vacanteTitulo;
    private String titulo;
    private String descripcion;
    private LocalDateTime createdAt;
}
