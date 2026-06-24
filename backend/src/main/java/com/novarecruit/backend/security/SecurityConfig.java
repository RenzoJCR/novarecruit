package com.novarecruit.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    private static final String ADMIN = "ROLE_ADMINISTRADOR";
    private static final String RRHH = "ROLE_RECURSOS_HUMANOS";
    private static final String TECNICO = "ROLE_LIDER_TECNICO";
    private static final String POSTULANTE = "ROLE_POSTULANTE";

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers("/ws", "/ws/**").permitAll()

                        .requestMatchers("/api/auth/**").permitAll()

                        /*
                         * Lecturas generales para no romper pantallas.
                         */
                        .requestMatchers(HttpMethod.GET, "/api/vacantes", "/api/vacantes/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/areas", "/api/areas/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/habilidades", "/api/habilidades/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/postulaciones", "/api/postulaciones/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/evaluaciones", "/api/evaluaciones/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/evaluaciones-postulacion", "/api/evaluaciones-postulacion/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/notificaciones", "/api/notificaciones/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/usuarios", "/api/usuarios/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/logs", "/api/logs/**").permitAll()

                        /*
                         * ADMINISTRADOR.
                         */
                        .requestMatchers(HttpMethod.POST, "/api/usuarios", "/api/usuarios/**").hasAuthority(ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/usuarios", "/api/usuarios/**").hasAuthority(ADMIN)
                        .requestMatchers(HttpMethod.PATCH, "/api/usuarios", "/api/usuarios/**").hasAuthority(ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/usuarios", "/api/usuarios/**").hasAuthority(ADMIN)

                        .requestMatchers(HttpMethod.POST, "/api/areas", "/api/areas/**").hasAuthority(ADMIN)
                        .requestMatchers(HttpMethod.PUT, "/api/areas", "/api/areas/**").hasAuthority(ADMIN)
                        .requestMatchers(HttpMethod.PATCH, "/api/areas", "/api/areas/**").hasAuthority(ADMIN)
                        .requestMatchers(HttpMethod.DELETE, "/api/areas", "/api/areas/**").hasAuthority(ADMIN)

                        /*
                         * RRHH.
                         */
                        .requestMatchers(HttpMethod.POST, "/api/vacantes", "/api/vacantes/**").hasAuthority(RRHH)
                        .requestMatchers(HttpMethod.PUT, "/api/vacantes", "/api/vacantes/**").hasAuthority(RRHH)
                        .requestMatchers(HttpMethod.DELETE, "/api/vacantes", "/api/vacantes/**").hasAuthority(RRHH)

                        .requestMatchers(HttpMethod.PATCH, "/api/vacantes", "/api/vacantes/**")
                        .hasAnyAuthority(RRHH, TECNICO)

                        .requestMatchers(HttpMethod.PUT, "/api/postulaciones", "/api/postulaciones/**").hasAuthority(RRHH)
                        .requestMatchers(HttpMethod.PATCH, "/api/postulaciones", "/api/postulaciones/**").hasAuthority(RRHH)

                        /*
                         * POSTULANTE.
                         */
                        .requestMatchers(HttpMethod.POST, "/api/postulaciones", "/api/postulaciones/**").hasAuthority(POSTULANTE)

                        .requestMatchers(HttpMethod.POST, "/api/evaluaciones-postulacion/enviar")
                        .hasAuthority(POSTULANTE)

                        /*
                         * LÍDER TÉCNICO.
                         */
                        .requestMatchers(HttpMethod.POST, "/api/evaluaciones", "/api/evaluaciones/**").hasAuthority(TECNICO)
                        .requestMatchers(HttpMethod.PUT, "/api/evaluaciones", "/api/evaluaciones/**").hasAuthority(TECNICO)
                        .requestMatchers(HttpMethod.PATCH, "/api/evaluaciones", "/api/evaluaciones/**").hasAuthority(TECNICO)
                        .requestMatchers(HttpMethod.DELETE, "/api/evaluaciones", "/api/evaluaciones/**").hasAuthority(TECNICO)

                        .requestMatchers(HttpMethod.POST, "/api/evaluaciones-postulacion/asignar")
                        .hasAuthority(TECNICO)

                        .requestMatchers(HttpMethod.PATCH, "/api/evaluaciones-postulacion/*/revision-tecnica")
                        .hasAuthority(TECNICO)

                        /*
                         * Habilidades.
                         */
                        .requestMatchers(HttpMethod.POST, "/api/habilidades", "/api/habilidades/**")
                        .hasAnyAuthority(ADMIN, RRHH)

                        .requestMatchers(HttpMethod.PUT, "/api/habilidades", "/api/habilidades/**")
                        .hasAnyAuthority(ADMIN, RRHH)

                        .requestMatchers(HttpMethod.PATCH, "/api/habilidades", "/api/habilidades/**")
                        .hasAnyAuthority(ADMIN, RRHH)

                        .requestMatchers(HttpMethod.DELETE, "/api/habilidades", "/api/habilidades/**")
                        .hasAnyAuthority(ADMIN, RRHH)

                        .requestMatchers("/api/ws-test/**").permitAll()

                        /*
                         * El resto se permite para no bloquear flujos no mapeados.
                         */
                        .requestMatchers("/api/**").permitAll()

                        .anyRequest().permitAll()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}