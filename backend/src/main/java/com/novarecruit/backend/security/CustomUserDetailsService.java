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

        return User.builder()
                .username(usuario.getCorreo())
                .password(usuario.getPassword())
                .authorities("ROLE_" + usuario.getRol().getNombre())
                .disabled(Boolean.FALSE.equals(usuario.getEstado()))
                .build();
    }
}