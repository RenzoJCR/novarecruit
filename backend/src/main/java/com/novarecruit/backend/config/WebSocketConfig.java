package com.novarecruit.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Arrays;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://127.0.0.1:5173}")
    private String allowedOrigins;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        /*
         * El backend publicará mensajes en:
         * /topic/notificaciones/{usuarioId}
         */
        registry.enableSimpleBroker("/topic");

        /*
         * Reservado por si luego el frontend envía mensajes al backend.
         */
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        String[] origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toArray(String[]::new);

        /*
         * Endpoint WebSocket nativo:
         *
         * Local:
         * ws://localhost:8080/ws
         *
         * Azure:
         * ws://57.156.65.62/ws
         */
        registry.addEndpoint("/ws")
                .setAllowedOrigins(origins);
    }
}