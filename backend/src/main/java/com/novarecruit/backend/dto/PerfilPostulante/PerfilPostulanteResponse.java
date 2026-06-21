package com.novarecruit.backend.dto.PerfilPostulante;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class PerfilPostulanteResponse {

    private Long id;
    private Long usuarioId;
    private String usuarioNombreCompleto;
    private String usuarioCorreo;
    private String descripcion;
    private String experiencia;
    private String linkedin;
    private String github;
    private String cvUrl;
    private LocalDateTime fechaActualizacion;
}
