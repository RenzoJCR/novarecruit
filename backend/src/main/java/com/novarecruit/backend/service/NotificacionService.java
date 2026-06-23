package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.response.NotificacionResponse;
import com.novarecruit.backend.entity.Notificacion;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.NotificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final NotificacionSocketService notificacionSocketService;

    /*
     * Método central del sistema de notificaciones.
     *
     * Cada vez que otra parte del sistema llama a crearNotificacion:
     *
     * 1. Se guarda la notificación en la tabla notificaciones.
     * 2. Se convierte a DTO.
     * 3. Después de confirmar la transacción en BD, se envía por WebSocket.
     *
     * Esto permite que el frontend actualice la vista de notificaciones
     * en tiempo real y sin recargar manualmente.
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

        emitirDespuesDeGuardar(response);

        return response;
    }

    /*
     * Este método evita un problema común:
     *
     * Si enviamos el WebSocket antes de que la transacción termine,
     * el frontend puede recibir el aviso y consultar la lista demasiado rápido,
     * cuando la notificación todavía no está confirmada en MySQL.
     *
     * Por eso esperamos al afterCommit.
     */
    private void emitirDespuesDeGuardar(NotificacionResponse response) {
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(
                    new TransactionSynchronization() {
                        @Override
                        public void afterCommit() {
                            notificacionSocketService.emitirNotificacion(response);
                        }
                    }
            );
        } else {
            notificacionSocketService.emitirNotificacion(response);
        }
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