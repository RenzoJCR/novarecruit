package com.novarecruit.backend.dto.PerfilPostulante;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PerfilPostulanteRequest {

    @NotNull(message = "El usuario es obligatorio.")
    private Long usuarioId;

    @Size(max = 1000, message = "La descripción no puede superar los 1000 caracteres.")
    private String descripcion;

    @Size(max = 2000, message = "La experiencia no puede superar los 2000 caracteres.")
    private String experiencia;

    @Size(max = 255, message = "El enlace de LinkedIn no puede superar los 255 caracteres.")
    private String linkedin;

    @Size(max = 255, message = "El enlace de GitHub no puede superar los 255 caracteres.")
    private String github;

    @Size(max = 255, message = "La URL del CV no puede superar los 255 caracteres.")
    private String cvUrl;
}
