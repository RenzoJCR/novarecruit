package com.novarecruit.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class UsuarioResponse {

    private Long id;
    private String nombres;
    private String apellidos;
    private String nombreCompleto;
    private String correo;
    private String telefono;
    private String fotoPerfil;
    private Boolean estado;
    private LocalDateTime fechaRegistro;

    private Long rolId;
    private String rolNombre;
}