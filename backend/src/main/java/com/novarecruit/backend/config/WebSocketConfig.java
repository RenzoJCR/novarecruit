package com.novarecruit.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /*
     * Activa WebSocket con STOMP.
     *
     * STOMP funciona como una capa de mensajería sobre WebSocket.
     * El backend publica mensajes en /topic/notificaciones
     * y el frontend se suscribe a ese canal.
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Canal donde el backend enviará mensajes al frontend.
        registry.enableSimpleBroker("/topic");

        // Prefijo reservado para mensajes enviados desde frontend hacia backend.
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        /*
         * Endpoint WebSocket nativo.
         *
         * El frontend se conectará a:
         * ws://localhost:8080/ws
         *
         * Aquí NO usamos SockJS para evitar el error "global is not defined" en Vite.
         */
        registry.addEndpoint("/ws")
                .setAllowedOrigins(
                        "http://localhost:5173",
                        "http://127.0.0.1:5173"
                );
    }
}