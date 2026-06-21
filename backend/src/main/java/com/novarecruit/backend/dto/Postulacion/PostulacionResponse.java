package com.novarecruit.backend.dto.Postulacion;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class PostulacionResponse {

    private Long id;
    private Long usuarioId;
    private String usuarioNombreCompleto;
    private Long vacanteId;
    private String vacanteTitulo;
    private String estado;
    private LocalDateTime fechaPostulacion;
    private String comentarioRrhh;
    private String comentarioTecnico;
    private Integer puntajeTecnico;
    private String respuestasPostulante;
    private LocalDateTime fechaEvaluacion;
}
