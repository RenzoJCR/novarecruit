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

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                /*
                 * Permite conexión entre React y Spring Boot.
                 */
                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                /*
                 * API REST con JWT:
                 * no usamos formulario, sesión tradicional ni CSRF.
                 */
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                /*
                 * Stateless:
                 * el backend no guarda sesión, cada request puede enviar JWT.
                 */
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        /*
                         * Necesario para CORS.
                         */
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        /*
                         * WebSocket/STOMP.
                         */
                        .requestMatchers("/ws", "/ws/**").permitAll()

                        /*
                         * Login, registro, verificación, cambio de contraseña, etc.
                         */
                        .requestMatchers("/api/auth/**").permitAll()

                        /*
                         * GET generales:
                         * Permitimos consultas para que las pantallas puedan cargar.
                         *
                         * En esta etapa protegemos principalmente acciones de escritura.
                         * Esto evita que el sistema se rompa por listados compartidos
                         * entre postulante, RRHH, técnico y admin.
                         */
                        .requestMatchers(HttpMethod.GET, "/api/vacantes/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/areas/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/habilidades/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/postulaciones/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/evaluaciones/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/evaluaciones-postulacion/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/notificaciones/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/usuarios/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/logs/**").permitAll()

                        /*
                         * ADMINISTRADOR:
                         * acciones administrativas fuertes.
                         */
                        .requestMatchers(HttpMethod.POST, "/api/usuarios/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PATCH, "/api/usuarios/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasRole("ADMINISTRADOR")

                        .requestMatchers(HttpMethod.POST, "/api/areas/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PUT, "/api/areas/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.PATCH, "/api/areas/**").hasRole("ADMINISTRADOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/areas/**").hasRole("ADMINISTRADOR")

                        /*
                         * RRHH:
                         * creación y edición de vacantes.
                         */
                        .requestMatchers(HttpMethod.POST, "/api/vacantes/**")
                        .hasRole("RECURSOS_HUMANOS")

                        .requestMatchers(HttpMethod.PUT, "/api/vacantes/**")
                        .hasRole("RECURSOS_HUMANOS")

                        .requestMatchers(HttpMethod.DELETE, "/api/vacantes/**")
                        .hasRole("RECURSOS_HUMANOS")

                        /*
                         * PATCH en vacantes:
                         * RRHH puede cambiar estados, y líder técnico puede intervenir
                         * en acciones finales si el flujo lo requiere.
                         */
                        .requestMatchers(HttpMethod.PATCH, "/api/vacantes/**")
                        .hasAnyRole("RECURSOS_HUMANOS", "LIDER_TECNICO")

                        /*
                         * POSTULANTE:
                         * puede crear postulaciones.
                         */
                        .requestMatchers(HttpMethod.POST, "/api/postulaciones/**")
                        .hasRole("POSTULANTE")

                        /*
                         * RRHH:
                         * revisa postulaciones.
                         */
                        .requestMatchers(HttpMethod.PUT, "/api/postulaciones/**")
                        .hasRole("RECURSOS_HUMANOS")

                        .requestMatchers(HttpMethod.PATCH, "/api/postulaciones/**")
                        .hasRole("RECURSOS_HUMANOS")

                        /*
                         * LÍDER TÉCNICO:
                         * crea, actualiza, reactiva o desactiva evaluaciones.
                         */
                        .requestMatchers(HttpMethod.POST, "/api/evaluaciones/**")
                        .hasRole("LIDER_TECNICO")

                        .requestMatchers(HttpMethod.PUT, "/api/evaluaciones/**")
                        .hasRole("LIDER_TECNICO")

                        .requestMatchers(HttpMethod.PATCH, "/api/evaluaciones/**")
                        .hasRole("LIDER_TECNICO")

                        .requestMatchers(HttpMethod.DELETE, "/api/evaluaciones/**")
                        .hasRole("LIDER_TECNICO")

                        /*
                         * Evaluación asignada:
                         * técnico asigna, postulante envía, técnico revisa.
                         */
                        .requestMatchers(HttpMethod.POST, "/api/evaluaciones-postulacion/asignar")
                        .hasRole("LIDER_TECNICO")

                        .requestMatchers(HttpMethod.POST, "/api/evaluaciones-postulacion/enviar")
                        .hasRole("POSTULANTE")

                        .requestMatchers(HttpMethod.PATCH, "/api/evaluaciones-postulacion/*/revision-tecnica")
                        .hasRole("LIDER_TECNICO")

                        /*
                         * Habilidades:
                         * gestión para roles internos.
                         */
                        .requestMatchers(HttpMethod.POST, "/api/habilidades/**")
                        .hasAnyRole("ADMINISTRADOR", "RECURSOS_HUMANOS")

                        .requestMatchers(HttpMethod.PUT, "/api/habilidades/**")
                        .hasAnyRole("ADMINISTRADOR", "RECURSOS_HUMANOS")

                        .requestMatchers(HttpMethod.PATCH, "/api/habilidades/**")
                        .hasAnyRole("ADMINISTRADOR", "RECURSOS_HUMANOS")

                        .requestMatchers(HttpMethod.DELETE, "/api/habilidades/**")
                        .hasAnyRole("ADMINISTRADOR", "RECURSOS_HUMANOS")

                        /*
                         * Endpoint de prueba WebSocket.
                         */
                        .requestMatchers("/api/ws-test/**").permitAll()

                        /*
                         * Cualquier otra API queda accesible para no romper el flujo.
                         * Las validaciones principales siguen estando en los services.
                         */
                        .requestMatchers("/api/**").permitAll()

                        .anyRequest().permitAll()
                )

                /*
                 * Si llega token, lo procesa y carga el usuario autenticado.
                 */
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}