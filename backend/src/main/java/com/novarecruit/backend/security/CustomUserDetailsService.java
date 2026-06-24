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
         * Aquí convertimos el rol de la BD a un formato que Spring Security pueda entender.
         *
         * Ejemplo:
         * ADMINISTRADOR -> ROLE_ADMINISTRADOR
         * RECURSOS_HUMANOS -> ROLE_RECURSOS_HUMANOS
         * LIDER_TECNICO -> ROLE_LIDER_TECNICO
         * POSTULANTE -> ROLE_POSTULANTE
         */
        String roleName = normalizarRol(usuario.getRol().getNombre());
        String authorityWithPrefix = "ROLE_" + roleName;

        return User.builder()
                .username(usuario.getCorreo())
                .password(usuario.getPassword())
                .authorities(authorityWithPrefix, roleName)
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
                .replace("-", "_")
                .replace("Á", "A")
                .replace("É", "E")
                .replace("Í", "I")
                .replace("Ó", "O")
                .replace("Ú", "U");

        if ("RRHH".equals(value) || "RECURSOSHUMANOS".equals(value) || "RECURSOS_HUMANOS".equals(value)) {
            return "RECURSOS_HUMANOS";
        }

        if ("LIDER_TECNICO".equals(value) || "LIDERTECNICO".equals(value)) {
            return "LIDER_TECNICO";
        }

        return value;
    }
}