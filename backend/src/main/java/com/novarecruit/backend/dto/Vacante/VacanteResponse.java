package com.novarecruit.backend.dto.Vacante;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class VacanteResponse {

    private Long id;
    private String titulo;
    private String descripcion;
    private String modalidad;
    private String ubicacion;
    private BigDecimal salario;
    private String nivelExperiencia;
    private String estado;
    private LocalDateTime fechaPublicacion;
    private LocalDate fechaCierre;
    private Long areaId;
    private String areaNombre;
    private Long rrhhId;
    private String rrhhNombre;
    private String rrhhRolNombre;
}
