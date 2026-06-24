package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.request.ChangePasswordRequest;
import com.novarecruit.backend.dto.request.LoginRequest;
import com.novarecruit.backend.dto.request.RegisterRequest;
import com.novarecruit.backend.dto.request.ResendCodeRequest;
import com.novarecruit.backend.dto.request.VerifyEmailRequest;
import com.novarecruit.backend.dto.response.AuthResponse;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.security.JwtService;
import com.novarecruit.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public AuthResponse registrarPostulante(@Valid @RequestBody RegisterRequest request) {
        return authService.registrarPostulante(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/verify-email")
    public AuthResponse verificarCorreo(@Valid @RequestBody VerifyEmailRequest request) {
        return authService.verificarCorreo(request);
    }

    @PostMapping("/resend-code")
    public AuthResponse reenviarCodigo(@Valid @RequestBody ResendCodeRequest request) {
        return authService.reenviarCodigo(request);
    }

    @PatchMapping("/change-password")
    public AuthResponse cambiarPassword(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new BusinessException("No hay token de autenticación. Inicia sesión nuevamente.");
        }

        String token = authorizationHeader.substring(7);

        String correoAutenticado;

        try {
            correoAutenticado = jwtService.extractUsername(token);
        } catch (Exception exception) {
            throw new BusinessException("Token inválido o vencido. Inicia sesión nuevamente.");
        }

        return authService.cambiarPassword(correoAutenticado, request);
    }
}