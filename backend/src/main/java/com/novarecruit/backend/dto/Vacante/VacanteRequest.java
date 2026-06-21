package com.novarecruit.backend.dto.Vacante;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class VacanteRequest {

    @NotBlank(message = "El título es obligatorio.")
    @Size(min = 3, max = 150, message = "El título debe tener entre 3 y 150 caracteres.")
    private String titulo;

    @NotBlank(message = "La descripción es obligatoria.")
    private String descripcion;

    @NotBlank(message = "La modalidad es obligatoria.")
    @Pattern(regexp = "^(PRESENCIAL|REMOTO|HIBRIDO)$", message = "La modalidad debe ser PRESENCIAL, REMOTO o HIBRIDO.")
    private String modalidad;

    @Size(max = 100, message = "La ubicación no puede superar los 100 caracteres.")
    private String ubicacion;

    @Positive(message = "El salario debe ser mayor a cero.")
    private BigDecimal salario;

    @Size(max = 50, message = "El nivel de experiencia no puede superar los 50 caracteres.")
    private String nivelExperiencia;

    @Pattern(regexp = "^(ACTIVA|CERRADA|CANCELADA)$", message = "El estado debe ser ACTIVA, CERRADA o CANCELADA.")
    private String estado;

    @FutureOrPresent(message = "La fecha de cierre debe ser hoy o futura.")
    private LocalDate fechaCierre;

    @NotNull(message = "El área es obligatoria.")
    private Long areaId;

    @NotNull(message = "El usuario de RRHH es obligatorio.")
    private Long rrhhId;
}
