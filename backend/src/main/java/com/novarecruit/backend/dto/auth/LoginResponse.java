package com.novarecruit.backend.dto.auth;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LoginResponse {

    private String token;
    private String tipoToken;
    private String correo;
    private String nombreCompleto;
    private String rol;
}