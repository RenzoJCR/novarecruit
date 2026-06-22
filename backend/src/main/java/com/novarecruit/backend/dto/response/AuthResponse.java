package com.novarecruit.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthResponse {

    private String token;
    private String tokenType;

    private Long userId;
    private String nombreCompleto;
    private String correo;
    private String rolNombre;

    private Boolean correoVerificado;
    private Boolean debeCambiarPassword;

    private String message;
}