package com.novarecruit.backend.dto.Rol;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class RolResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private LocalDateTime createdAt;
}
