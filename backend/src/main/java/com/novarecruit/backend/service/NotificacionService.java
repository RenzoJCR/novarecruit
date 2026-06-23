package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.response.NotificacionResponse;
import com.novarecruit.backend.entity.Notificacion;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.NotificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final NotificacionSocketService notificacionSocketService;

    /*
     * Crea una notificación y la envía en tiempo real.
     *
     * Flujo:
     * 1. Guarda la notificación en la BD.
     * 2. La convierte a DTO.
     * 3. La emite por WebSocket/STOMP.
     *
     * Esto permite que la vista de notificaciones se actualice sola
     * sin que el usuario tenga que presionar "Actualizar".
     */
    @Transactional
    public NotificacionResponse crearNotificacion(
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

        notificacionSocketService.emitirNotificacion(response);

        return response;
    }

    @Transactional(readOnly = true)
    public List<NotificacionResponse> listarPorUsuario(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdOrderByCreatedAtDesc(usuarioId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NotificacionResponse> listarNoLeidasPorUsuario(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdAndLeidoFalseOrderByCreatedAtDesc(usuarioId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
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