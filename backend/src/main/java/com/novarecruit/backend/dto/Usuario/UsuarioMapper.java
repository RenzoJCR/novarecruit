package com.novarecruit.backend.dto.Usuario;

import com.novarecruit.backend.entity.Rol;
import com.novarecruit.backend.entity.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    public UsuarioResponse toResponse(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        Rol rol = usuario.getRol();

        return UsuarioResponse.builder()
                .id(usuario.getId())
                .nombres(usuario.getNombres())
                .apellidos(usuario.getApellidos())
                .correo(usuario.getCorreo())
                .telefono(usuario.getTelefono())
                .fotoPerfil(usuario.getFotoPerfil())
                .estado(usuario.getEstado())
                .fechaRegistro(usuario.getFechaRegistro())
                .rolId(rol != null ? rol.getId() : null)
                .rolNombre(rol != null ? rol.getNombre() : null)
                .build();
    }

    public Usuario toEntity(UsuarioRequest request, Rol rol) {
        if (request == null) {
            return null;
        }

        return Usuario.builder()
                .nombres(normalize(request.getNombres()))
                .apellidos(normalize(request.getApellidos()))
                .correo(normalizeEmail(request.getCorreo()))
                .password(normalize(request.getPassword()))
                .telefono(normalize(request.getTelefono()))
                .fotoPerfil(normalize(request.getFotoPerfil()))
				.estado(request.getEstado() == null || request.getEstado())
                .rol(rol)
                .build();
    }

    public void updateEntity(Usuario usuario, UsuarioRequest request, Rol rol) {
        if (usuario == null || request == null) {
            return;
        }

        usuario.setNombres(normalize(request.getNombres()));
        usuario.setApellidos(normalize(request.getApellidos()));
        usuario.setCorreo(normalizeEmail(request.getCorreo()));
        usuario.setPassword(normalize(request.getPassword()));
        usuario.setTelefono(normalize(request.getTelefono()));
        usuario.setFotoPerfil(normalize(request.getFotoPerfil()));

        if (request.getEstado() != null) {
            usuario.setEstado(request.getEstado());
        }

        if (rol != null) {
            usuario.setRol(rol);
        }
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String normalizedValue = value.trim();
        return normalizedValue.isEmpty() ? null : normalizedValue;
    }

    private String normalizeEmail(String value) {
        String normalizedValue = normalize(value);
        return normalizedValue != null ? normalizedValue.toLowerCase() : null;
    }
}
