package com.novarecruit.backend.dto.auth;

import com.novarecruit.backend.dto.Usuario.UsuarioResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthResponse {

    private String token;
    private String tokenType;
    private UsuarioResponse user;
}
