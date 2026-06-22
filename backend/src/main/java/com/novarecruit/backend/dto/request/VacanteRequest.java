package com.novarecruit.backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class VacanteRequest {

    @NotBlank(message = "El título de la vacante es obligatorio.")
    @Size(min = 5, max = 150, message = "El título debe tener entre 5 y 150 caracteres.")
    private String titulo;

    @NotBlank(message = "La descripción de la vacante es obligatoria.")
    @Size(min = 20, message = "La descripción debe tener al menos 20 caracteres.")
    private String descripcion;

    @NotBlank(message = "La modalidad es obligatoria.")
    private String modalidad;

    @Size(max = 100, message = "La ubicación no debe superar los 100 caracteres.")
    private String ubicacion;

    @DecimalMin(value = "0.01", message = "El salario debe ser mayor a cero.")
    private BigDecimal salario;

    @NotBlank(message = "El nivel de experiencia es obligatorio.")
    @Size(max = 50, message = "El nivel de experiencia no debe superar los 50 caracteres.")
    private String nivelExperiencia;

    @FutureOrPresent(message = "La fecha de cierre no puede ser anterior a la fecha actual.")
    private LocalDate fechaCierre;

    @NotNull(message = "El área es obligatoria.")
    private Long areaId;

    @NotNull(message = "El usuario RRHH es obligatorio.")
    private Long rrhhId;

    @NotEmpty(message = "La vacante debe tener al menos una habilidad requerida.")
    private List<@Valid VacanteHabilidadRequest> habilidades;
}