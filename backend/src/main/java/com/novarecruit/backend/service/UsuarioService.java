package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.Usuario.UsuarioMapper;
import com.novarecruit.backend.dto.Usuario.UsuarioRequest;
import com.novarecruit.backend.dto.Usuario.UsuarioResponse;
import com.novarecruit.backend.entity.Rol;
import com.novarecruit.backend.entity.Usuario;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.RolRepository;
import com.novarecruit.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final UsuarioMapper usuarioMapper;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<UsuarioResponse> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(usuarioMapper::toResponse)
                .toList();
    }

    public UsuarioResponse obtenerUsuarioPorId(Long id) {
        return usuarioMapper.toResponse(buscarUsuarioPorId(id));
    }

    public UsuarioResponse crearUsuario(UsuarioRequest request) {
        String correo = normalizarCorreo(request.getCorreo());

        if (usuarioRepository.existsByCorreoIgnoreCase(correo)) {
            throw new BusinessException("Ya existe un usuario registrado con ese correo.");
        }

        Rol rol = buscarRolPorId(request.getRolId());
        Usuario usuario = usuarioMapper.toEntity(request, rol);
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));

        return usuarioMapper.toResponse(usuarioRepository.save(usuario));
    }

    public UsuarioResponse actualizarUsuario(Long id, UsuarioRequest request) {
        Usuario usuario = buscarUsuarioPorId(id);
        String correo = normalizarCorreo(request.getCorreo());

        if (usuarioRepository.existsByCorreoIgnoreCaseAndIdNot(correo, id)) {
            throw new BusinessException("Ya existe otro usuario registrado con ese correo.");
        }

        Rol rol = request.getRolId() != null ? buscarRolPorId(request.getRolId()) : usuario.getRol();
        usuarioMapper.updateEntity(usuario, request, rol);

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return usuarioMapper.toResponse(usuarioRepository.save(usuario));
    }

    public UsuarioResponse desactivarUsuario(Long id) {
        Usuario usuario = buscarUsuarioPorId(id);
        usuario.setEstado(false);
        return usuarioMapper.toResponse(usuarioRepository.save(usuario));
    }

    private Usuario buscarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró el usuario solicitado."));
    }

    private Rol buscarRolPorId(Long id) {
        return rolRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró el rol solicitado."));
    }

    private String normalizarCorreo(String correo) {
        if (correo == null || correo.trim().isEmpty()) {
            throw new BusinessException("El correo es obligatorio.");
        }

        return correo.trim().toLowerCase();
    }
}