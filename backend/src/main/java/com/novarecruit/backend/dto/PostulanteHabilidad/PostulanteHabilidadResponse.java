package com.novarecruit.backend.dto.PostulanteHabilidad;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PostulanteHabilidadResponse {

    private Long id;
    private Long postulacionId;
    private String postulacionEstado;
    private Long habilidadId;
    private String habilidadNombre;
    private String nivelPostulante;
    private Integer aniosExperiencia;
}
