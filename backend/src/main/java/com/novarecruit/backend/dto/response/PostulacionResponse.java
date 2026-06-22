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
public class PostulacionResponse {

    private Long id;

    private Long usuarioId;
    private String postulanteNombre;
    private String postulanteCorreo;

    private Long vacanteId;
    private String vacanteTitulo;
    private String areaNombre;

    private String estado;
    private LocalDateTime fechaPostulacion;

    private String comentarioRrhh;
    private String comentarioTecnico;

    private BigDecimal puntajeTecnico;
    private Boolean esGanador;

    private List<PostulanteHabilidadResponse> habilidades;
}