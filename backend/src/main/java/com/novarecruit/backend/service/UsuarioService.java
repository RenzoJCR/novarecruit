package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.request.UsuarioRequest;
import com.novarecruit.backend.dto.response.UsuarioResponse;
import com.novarecruit.backend.entity.Rol;
import com.novarecruit.backend.entity.Usuario;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolService rolService;
    private final LogSistemaService logSistemaService;
    private final PasswordEncoder passwordEncoder;

    public List<UsuarioResponse> listarUsuarios() {
        return usuarioRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public UsuarioResponse obtenerUsuarioPorId(Long id) {
        Usuario usuario = buscarUsuarioPorId(id);
        return mapToResponse(usuario);
    }

    public UsuarioResponse crearUsuario(UsuarioRequest request) {
        String correoNormalizado = normalizarCorreo(request.getCorreo());

        if (usuarioRepository.existsByCorreoIgnoreCase(correoNormalizado)) {
            throw new BusinessException("Ya existe un usuario registrado con ese correo.");
        }

        Rol rol = rolService.buscarRolPorId(request.getRolId());

        Usuario usuario = Usuario.builder()
                .nombres(normalizarTexto(request.getNombres()))
                .apellidos(normalizarTexto(request.getApellidos()))
                .correo(correoNormalizado)
                .password(passwordEncoder.encode(request.getPassword().trim()))
                .telefono(normalizarTextoOpcional(request.getTelefono()))
                .fotoPerfil(normalizarTextoOpcional(request.getFotoPerfil()))
                .estado(request.getEstado() != null ? request.getEstado() : true)
                .correoVerificado(true)
                .debeCambiarPassword(true)
                .rol(rol)
                .build();

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        logSistemaService.registrarLog(
                null,
                "CREAR_USUARIO",
                "USUARIOS",
                "Se creó el usuario interno: " + usuarioGuardado.getCorreo(),
                "127.0.0.1"
        );

        return mapToResponse(usuarioGuardado);
    }

    public UsuarioResponse actualizarUsuario(Long id, UsuarioRequest request) {
        Usuario usuario = buscarUsuarioPorId(id);

        String correoNormalizado = normalizarCorreo(request.getCorreo());

        if (usuarioRepository.existsByCorreoIgnoreCaseAndIdNot(correoNormalizado, id)) {
            throw new BusinessException("Ya existe otro usuario registrado con ese correo.");
        }

        Rol rol = rolService.buscarRolPorId(request.getRolId());

        usuario.setNombres(normalizarTexto(request.getNombres()));
        usuario.setApellidos(normalizarTexto(request.getApellidos()));
        usuario.setCorreo(correoNormalizado);
        usuario.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        usuario.setTelefono(normalizarTextoOpcional(request.getTelefono()));
        usuario.setFotoPerfil(normalizarTextoOpcional(request.getFotoPerfil()));
        usuario.setRol(rol);
        usuario.setCorreoVerificado(true);
        usuario.setDebeCambiarPassword(true);

        if (request.getEstado() != null) {
            usuario.setEstado(request.getEstado());
        }

        Usuario usuarioActualizado = usuarioRepository.save(usuario);

        logSistemaService.registrarLog(
                null,
                "ACTUALIZAR_USUARIO",
                "USUARIOS",
                "Se actualizó el usuario: " + usuarioActualizado.getCorreo(),
                "127.0.0.1"
        );

        return mapToResponse(usuarioActualizado);
    }

    public void desactivarUsuario(Long id) {
        Usuario usuario = buscarUsuarioPorId(id);

        if (Boolean.FALSE.equals(usuario.getEstado())) {
            throw new BusinessException("El usuario ya se encuentra desactivado.");
        }

        usuario.setEstado(false);
        usuarioRepository.save(usuario);

        logSistemaService.registrarLog(
                null,
                "DESACTIVAR_USUARIO",
                "USUARIOS",
                "Se desactivó el usuario: " + usuario.getCorreo(),
                "127.0.0.1"
        );
    }

    private Usuario buscarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró el usuario solicitado."));
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

    private String normalizarCorreo(String correo) {
        return correo == null ? null : correo.trim().toLowerCase();
    }

    private UsuarioResponse mapToResponse(Usuario usuario) {
        String nombreCompleto = usuario.getNombres() + " " + usuario.getApellidos();

        return UsuarioResponse.builder()
                .id(usuario.getId())
                .nombres(usuario.getNombres())
                .apellidos(usuario.getApellidos())
                .nombreCompleto(nombreCompleto)
                .correo(usuario.getCorreo())
                .telefono(usuario.getTelefono())
                .fotoPerfil(usuario.getFotoPerfil())
                .estado(usuario.getEstado())
                .correoVerificado(usuario.getCorreoVerificado())
                .debeCambiarPassword(usuario.getDebeCambiarPassword())
                .fechaRegistro(usuario.getFechaRegistro())
                .rolId(usuario.getRol().getId())
                .rolNombre(usuario.getRol().getNombre())
                .build();
    }
}