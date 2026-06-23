package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.response.NotificacionResponse;
import com.novarecruit.backend.dto.response.NotificacionSocketResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificacionSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    /*
     * Este método publica una notificación en tiempo real.
     *
     * El backend manda el mensaje al canal /topic/notificaciones.
     * El frontend está suscrito a ese canal y filtra por usuarioId.
     */
    public void emitirNotificacion(NotificacionResponse notificacion) {
        NotificacionSocketResponse response = NotificacionSocketResponse.builder()
                .id(notificacion.getId())
                .usuarioId(notificacion.getUsuarioId())
                .titulo(notificacion.getTitulo())
                .mensaje(notificacion.getMensaje())
                .tipo(notificacion.getTipo())
                .urlDestino(notificacion.getUrlDestino())
                .leido(notificacion.getLeido())
                .createdAt(notificacion.getCreatedAt())
                .build();

        messagingTemplate.convertAndSend("/topic/notificaciones", response);
    }
}