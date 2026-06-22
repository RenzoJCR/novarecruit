package com.novarecruit.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class LogSistemaResponse {

    private Long id;
    private Long usuarioId;
    private String accion;
    private String modulo;
    private String descripcion;
    private LocalDateTime fechaHora;
    private String ipOrigen;
}