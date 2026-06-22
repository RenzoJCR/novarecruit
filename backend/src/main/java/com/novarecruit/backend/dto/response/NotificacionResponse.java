package com.novarecruit.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class NotificacionResponse {

    private Long id;
    private Long usuarioId;
    private String titulo;
    private String mensaje;
    private String tipo;
    private String urlDestino;
    private Boolean leido;
    private LocalDateTime createdAt;
}