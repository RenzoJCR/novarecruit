package com.novarecruit.backend.security;

import com.novarecruit.backend.entity.Usuario;
import com.novarecruit.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado."));

        /*
         * Spring Security usa authorities.
         *
         * Ejemplo:
         * ADMINISTRADOR -> ROLE_ADMINISTRADOR
         * POSTULANTE -> ROLE_POSTULANTE
         */
        String roleName = normalizarRol(usuario.getRol().getNombre());
        String authority = "ROLE_" + roleName;

        return User.builder()
                .username(usuario.getCorreo())
                .password(usuario.getPassword())
                .authorities(authority)
                .disabled(Boolean.FALSE.equals(usuario.getEstado()))
                .build();
    }

    private String normalizarRol(String rol) {
        if (rol == null) {
            return "";
        }

        String value = rol.trim()
                .toUpperCase()
                .replace(" ", "_")
                .replace("-", "_");

        if ("RRHH".equals(value) || "RECURSOSHUMANOS".equals(value)) {
            return "RECURSOS_HUMANOS";
        }

        if ("RECURSOS_HUMANOS".equals(value)) {
            return "RECURSOS_HUMANOS";
        }

        if ("LIDER_TECNICO".equals(value) || "LÍDER_TÉCNICO".equals(value)) {
            return "LIDER_TECNICO";
        }

        return value;
    }
}