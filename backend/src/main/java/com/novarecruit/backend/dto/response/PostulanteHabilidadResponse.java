package com.novarecruit.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PostulanteHabilidadResponse {

    private Long id;
    private Long habilidadId;
    private String habilidadNombre;
    private String categoria;
    private String nivelPostulante;
    private Integer aniosExperiencia;
}