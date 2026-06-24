package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.response.NotificacionResponse;
import com.novarecruit.backend.entity.Notificacion;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.NotificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /*
     * Crea una notificación y además la envía en tiempo real por WebSocket.
     *
     * Flujo:
     * 1. Se guarda en la tabla notificaciones.
     * 2. Se convierte a NotificacionResponse.
     * 3. Se publica al canal /topic/notificaciones/{usuarioId}.
     *
     * El frontend está suscrito exactamente a ese canal.
     */
    public void crearNotificacion(
            Long usuarioId,
            String titulo,
            String mensaje,
            String tipo,
            String urlDestino
    ) {
        Notificacion notificacion = Notificacion.builder()
                .usuarioId(usuarioId)
                .titulo(titulo)
                .mensaje(mensaje)
                .tipo(tipo)
                .urlDestino(urlDestino)
                .leido(false)
                .build();

        Notificacion guardada = notificacionRepository.save(notificacion);

        NotificacionResponse response = mapToResponse(guardada);

        messagingTemplate.convertAndSend(
                "/topic/notificaciones/" + usuarioId,
                response
        );
    }

    public List<NotificacionResponse> listarPorUsuario(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdOrderByCreatedAtDesc(usuarioId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<NotificacionResponse> listarNoLeidasPorUsuario(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdAndLeidoFalseOrderByCreatedAtDesc(usuarioId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public NotificacionResponse marcarComoLeida(Long id) {
        Notificacion notificacion = notificacionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la notificación solicitada."));

        notificacion.setLeido(true);

        Notificacion actualizada = notificacionRepository.save(notificacion);

        return mapToResponse(actualizada);
    }

    private NotificacionResponse mapToResponse(Notificacion notificacion) {
        return NotificacionResponse.builder()
                .id(notificacion.getId())
                .usuarioId(notificacion.getUsuarioId())
                .titulo(notificacion.getTitulo())
                .mensaje(notificacion.getMensaje())
                .tipo(notificacion.getTipo())
                .urlDestino(notificacion.getUrlDestino())
                .leido(notificacion.getLeido())
                .createdAt(notificacion.getCreatedAt())
                .build();
    }
}