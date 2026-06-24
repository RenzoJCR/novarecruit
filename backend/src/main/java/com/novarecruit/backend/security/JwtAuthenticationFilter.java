package com.novarecruit.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        /*
         * El frontend debe enviar:
         * Authorization: Bearer TOKEN
         */
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            String correo = jwtService.extractUsername(token);
            String rol = normalizarRol(jwtService.extractRole(token));

            if (
                    correo != null &&
                            rol != null &&
                            jwtService.isTokenValid(token) &&
                            SecurityContextHolder.getContext().getAuthentication() == null
            ) {
                /*
                 * Cargamos ambas autoridades:
                 * ROLE_ADMINISTRADOR y ADMINISTRADOR.
                 *
                 * Así funciona tanto con hasRole como con hasAuthority.
                 */
                List<SimpleGrantedAuthority> authorities = List.of(
                        new SimpleGrantedAuthority("ROLE_" + rol),
                        new SimpleGrantedAuthority(rol)
                );

                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                correo,
                                null,
                                authorities
                        );

                authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        } catch (Exception ex) {
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private String normalizarRol(String rol) {
        if (rol == null) {
            return null;
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

        if ("LIDERTECNICO".equals(value) || "LIDER_TECNICO".equals(value)) {
            return "LIDER_TECNICO";
        }

        return value;
    }
}