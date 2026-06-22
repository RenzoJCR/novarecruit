package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.request.*;
import com.novarecruit.backend.dto.response.AuthResponse;
import com.novarecruit.backend.entity.EmailVerificacion;
import com.novarecruit.backend.entity.Rol;
import com.novarecruit.backend.entity.Usuario;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.EmailVerificacionRepository;
import com.novarecruit.backend.repository.RolRepository;
import com.novarecruit.backend.repository.UsuarioRepository;
import com.novarecruit.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final EmailVerificacionRepository emailVerificacionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final LogSistemaService logSistemaService;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public AuthResponse registrarPostulante(RegisterRequest request) {
        String correoNormalizado = normalizarCorreo(request.getCorreo());

        if (usuarioRepository.existsByCorreoIgnoreCase(correoNormalizado)) {
            throw new BusinessException("Ya existe una cuenta registrada con ese correo.");
        }

        Rol rolPostulante = rolRepository.findByNombreIgnoreCase("POSTULANTE")
                .orElseThrow(() -> new BusinessException("No se encontró el rol POSTULANTE en la base de datos."));

        Usuario usuario = Usuario.builder()
                .nombres(normalizarTexto(request.getNombres()))
                .apellidos(normalizarTexto(request.getApellidos()))
                .correo(correoNormalizado)
                .password(passwordEncoder.encode(request.getPassword().trim()))
                .telefono(normalizarTextoOpcional(request.getTelefono()))
                .fotoPerfil(null)
                .estado(true)
                .correoVerificado(false)
                .debeCambiarPassword(false)
                .rol(rolPostulante)
                .build();

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        generarYEnviarCodigo(usuarioGuardado);

        logSistemaService.registrarLog(
                usuarioGuardado.getId(),
                "REGISTRO_POSTULANTE",
                "AUTH",
                "Se registró un nuevo postulante: " + usuarioGuardado.getCorreo(),
                "127.0.0.1"
        );

        return AuthResponse.builder()
                .token(null)
                .tokenType("Bearer")
                .userId(usuarioGuardado.getId())
                .nombreCompleto(nombreCompleto(usuarioGuardado))
                .correo(usuarioGuardado.getCorreo())
                .rolNombre(usuarioGuardado.getRol().getNombre())
                .correoVerificado(false)
                .debeCambiarPassword(false)
                .message("Registro exitoso. Revisa tu correo e ingresa el código de verificación.")
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String correoNormalizado = normalizarCorreo(request.getCorreo());

        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(correoNormalizado)
                .orElseThrow(() -> new BusinessException("Correo o contraseña incorrectos."));

        if (Boolean.FALSE.equals(usuario.getEstado())) {
            throw new BusinessException("El usuario se encuentra inactivo.");
        }

        if (!passwordValida(request.getPassword(), usuario)) {
            throw new BusinessException("Correo o contraseña incorrectos.");
        }

        if (Boolean.FALSE.equals(usuario.getCorreoVerificado())) {
            generarYEnviarCodigo(usuario);

            return AuthResponse.builder()
                    .token(null)
                    .tokenType("Bearer")
                    .userId(usuario.getId())
                    .nombreCompleto(nombreCompleto(usuario))
                    .correo(usuario.getCorreo())
                    .rolNombre(usuario.getRol().getNombre())
                    .correoVerificado(false)
                    .debeCambiarPassword(usuario.getDebeCambiarPassword())
                    .message("Tu correo aún no está verificado. Se envió un nuevo código de verificación.")
                    .build();
        }

        String token = jwtService.generateToken(usuario);

        logSistemaService.registrarLog(
                usuario.getId(),
                "LOGIN",
                "AUTH",
                "Inicio de sesión correcto: " + usuario.getCorreo(),
                "127.0.0.1"
        );

        return buildAuthResponse(usuario, token, "Inicio de sesión correcto.");
    }

    @Transactional
    public AuthResponse verificarCorreo(VerifyEmailRequest request) {
        String correoNormalizado = normalizarCorreo(request.getCorreo());

        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(correoNormalizado)
                .orElseThrow(() -> new BusinessException("No se encontró una cuenta con ese correo."));

        if (Boolean.TRUE.equals(usuario.getCorreoVerificado())) {
            String token = jwtService.generateToken(usuario);
            return buildAuthResponse(usuario, token, "El correo ya estaba verificado.");
        }

        EmailVerificacion verificacion = emailVerificacionRepository
                .findTopByUsuario_IdAndUsadoFalseOrderByCreatedAtDesc(usuario.getId())
                .orElseThrow(() -> new BusinessException("No hay un código activo para este usuario. Solicita uno nuevo."));

        if (verificacion.getIntentos() >= 5) {
            throw new BusinessException("Se superó el número máximo de intentos. Solicita un nuevo código.");
        }

        if (verificacion.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            throw new BusinessException("El código de verificación ha expirado. Solicita uno nuevo.");
        }

        if (!verificacion.getCodigo().equals(request.getCodigo().trim())) {
            verificacion.setIntentos(verificacion.getIntentos() + 1);
            emailVerificacionRepository.save(verificacion);
            throw new BusinessException("El código ingresado no es correcto.");
        }

        verificacion.setUsado(true);
        emailVerificacionRepository.save(verificacion);

        usuario.setCorreoVerificado(true);
        usuarioRepository.save(usuario);

        String token = jwtService.generateToken(usuario);

        logSistemaService.registrarLog(
                usuario.getId(),
                "VERIFICAR_CORREO",
                "AUTH",
                "El usuario verificó su correo: " + usuario.getCorreo(),
                "127.0.0.1"
        );

        return buildAuthResponse(usuario, token, "Correo verificado correctamente.");
    }

    @Transactional
    public AuthResponse reenviarCodigo(ResendCodeRequest request) {
        String correoNormalizado = normalizarCorreo(request.getCorreo());

        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(correoNormalizado)
                .orElseThrow(() -> new BusinessException("No se encontró una cuenta con ese correo."));

        if (Boolean.TRUE.equals(usuario.getCorreoVerificado())) {
            throw new BusinessException("Este correo ya se encuentra verificado.");
        }

        generarYEnviarCodigo(usuario);

        return AuthResponse.builder()
                .token(null)
                .tokenType("Bearer")
                .userId(usuario.getId())
                .nombreCompleto(nombreCompleto(usuario))
                .correo(usuario.getCorreo())
                .rolNombre(usuario.getRol().getNombre())
                .correoVerificado(false)
                .debeCambiarPassword(usuario.getDebeCambiarPassword())
                .message("Se envió un nuevo código de verificación.")
                .build();
    }

    @Transactional
    public AuthResponse cambiarPassword(String correoAutenticado, ChangePasswordRequest request) {
        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(correoAutenticado)
                .orElseThrow(() -> new BusinessException("No se encontró el usuario autenticado."));

        if (!passwordValida(request.getPasswordActual(), usuario)) {
            throw new BusinessException("La contraseña actual no es correcta.");
        }

        if (passwordValida(request.getNuevaPassword(), usuario)) {
            throw new BusinessException("La nueva contraseña no puede ser igual a la actual.");
        }

        usuario.setPassword(passwordEncoder.encode(request.getNuevaPassword().trim()));
        usuario.setDebeCambiarPassword(false);

        Usuario usuarioActualizado = usuarioRepository.save(usuario);

        String token = jwtService.generateToken(usuarioActualizado);

        logSistemaService.registrarLog(
                usuarioActualizado.getId(),
                "CAMBIAR_PASSWORD",
                "AUTH",
                "El usuario cambió su contraseña: " + usuarioActualizado.getCorreo(),
                "127.0.0.1"
        );

        return buildAuthResponse(usuarioActualizado, token, "Contraseña actualizada correctamente.");
    }

    private void generarYEnviarCodigo(Usuario usuario) {
        invalidarCodigosPrevios(usuario);

        String codigo = String.format("%06d", secureRandom.nextInt(1_000_000));

        EmailVerificacion verificacion = EmailVerificacion.builder()
                .usuario(usuario)
                .codigo(codigo)
                .usado(false)
                .intentos(0)
                .fechaExpiracion(LocalDateTime.now().plusMinutes(15))
                .build();

        emailVerificacionRepository.save(verificacion);

        emailService.enviarCodigoVerificacion(
                usuario.getCorreo(),
                nombreCompleto(usuario),
                codigo
        );
    }

    private void invalidarCodigosPrevios(Usuario usuario) {
        emailVerificacionRepository.findByUsuario_IdAndUsadoFalse(usuario.getId())
                .forEach(verificacion -> {
                    verificacion.setUsado(true);
                    emailVerificacionRepository.save(verificacion);
                });
    }

    private boolean passwordValida(String rawPassword, Usuario usuario) {
        String storedPassword = usuario.getPassword();

        if (storedPassword != null && storedPassword.startsWith("$2")) {
            return passwordEncoder.matches(rawPassword, storedPassword);
        }

        boolean plainMatch = storedPassword != null && storedPassword.equals(rawPassword);

        if (plainMatch) {
            usuario.setPassword(passwordEncoder.encode(rawPassword));
            usuarioRepository.save(usuario);
        }

        return plainMatch;
    }

    private AuthResponse buildAuthResponse(Usuario usuario, String token, String message) {
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(usuario.getId())
                .nombreCompleto(nombreCompleto(usuario))
                .correo(usuario.getCorreo())
                .rolNombre(usuario.getRol().getNombre())
                .correoVerificado(usuario.getCorreoVerificado())
                .debeCambiarPassword(usuario.getDebeCambiarPassword())
                .message(message)
                .build();
    }

    private String nombreCompleto(Usuario usuario) {
        return usuario.getNombres() + " " + usuario.getApellidos();
    }

    private String normalizarCorreo(String correo) {
        return correo == null ? null : correo.trim().toLowerCase();
    }

    private String normalizarTexto(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizarTextoOpcional(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}