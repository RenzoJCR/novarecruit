package com.novarecruit.backend.service;

import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.novarecruit.backend.config.JwtService;
import com.novarecruit.backend.dto.auth.AuthRegisterRequest;
import com.novarecruit.backend.dto.auth.ChangePasswordRequest;
import com.novarecruit.backend.dto.auth.LoginRequest;
import com.novarecruit.backend.dto.auth.LoginResponse;
import com.novarecruit.backend.entity.Rol;
import com.novarecruit.backend.entity.Usuario;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.RolRepository;
import com.novarecruit.backend.repository.UsuarioRepository;

@Service
public class AuthService {

    private static final String ROL_POSTULANTE = "POSTULANTE";

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(request.getCorreo())
                .orElseThrow(() -> new BusinessException("Credenciales inválidas."));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new BusinessException("Credenciales inválidas.");
        }

        return buildLoginResponse(usuario);
    }

    @Transactional
    public LoginResponse register(AuthRegisterRequest request) {
        if (usuarioRepository.existsByCorreoIgnoreCase(request.getCorreo())) {
            throw new BusinessException("Ya existe un usuario con ese correo.");
        }

        Rol rolPostulante = obtenerOCrearRolPostulante();

        Usuario usuario = Usuario.builder()
                .nombres(request.getNombres())
                .apellidos(request.getApellidos())
                .correo(request.getCorreo())
                .password(passwordEncoder.encode(request.getPassword()))
                .telefono(request.getTelefono())
                .fotoPerfil(request.getFotoPerfil())
                .estado(true)
                .rol(rolPostulante)
                .build();

        Usuario savedUser = usuarioRepository.save(usuario);
        return buildLoginResponse(savedUser);
    }

    private Rol obtenerOCrearRolPostulante() {
        return rolRepository.findByNombreIgnoreCase(ROL_POSTULANTE)
                .orElseGet(() -> rolRepository.save(Rol.builder()
                        .nombre(ROL_POSTULANTE)
                        .descripcion("Usuario que aplica a vacantes")
                        .build()));
    }

    @Transactional
    public void changePassword(String correo, ChangePasswordRequest request) {
        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new BusinessException("No se encontró el usuario autenticado."));

        if (!passwordEncoder.matches(request.getCurrentPassword(), usuario.getPassword())) {
            throw new BusinessException("La contraseña actual no es correcta.");
        }

        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new BusinessException("La nueva contraseña y su confirmación no coinciden.");
        }

        usuario.setPassword(passwordEncoder.encode(request.getNewPassword()));
        usuarioRepository.save(usuario);
    }

    public LoginResponse me(String correo) {
        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new BusinessException("No se encontró el usuario autenticado."));

        return buildLoginResponse(usuario);
    }

    private LoginResponse buildLoginResponse(Usuario usuario) {
        String rolNombre = usuario.getRol() != null ? usuario.getRol().getNombre() : null;
        String token = jwtService.generateToken(usuario.getCorreo(), Map.of(
                "rol", rolNombre != null ? rolNombre : ""
        ));

        return LoginResponse.builder()
                .token(token)
                .tipoToken("Bearer")
                .correo(usuario.getCorreo())
                .nombreCompleto(usuario.getNombres() + " " + usuario.getApellidos())
                .rol(rolNombre)
                .build();
    }
}