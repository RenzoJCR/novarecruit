package com.novarecruit.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificacionSocketResponse {

    /*
     * DTO que viaja por WebSocket.
     * Incluye los mismos datos principales de la notificación guardada en BD.
     */
    private Long id;
    private Long usuarioId;
    private String titulo;
    private String mensaje;
    private String tipo;
    private String urlDestino;
    private Boolean leido;
    private LocalDateTime createdAt;
}