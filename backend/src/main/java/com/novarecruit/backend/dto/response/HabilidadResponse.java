package com.novarecruit.backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class HabilidadResponse {

    private Long id;
    private String nombre;
    private String categoria;
    private Boolean estado;
    private LocalDateTime createdAt;
}