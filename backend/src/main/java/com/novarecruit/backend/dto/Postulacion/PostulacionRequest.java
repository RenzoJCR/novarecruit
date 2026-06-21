package com.novarecruit.backend.dto.Postulacion;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PostulacionRequest {

    @NotNull(message = "El usuario es obligatorio.")
    private Long usuarioId;

    @NotNull(message = "La vacante es obligatoria.")
    private Long vacanteId;

    @Pattern(
            regexp = "^(POSTULADO|EN_REVISION|ENTREVISTA|EVALUACION_TECNICA|RECHAZADO|ACEPTADO)$",
            message = "El estado de la postulación no es válido."
    )
    private String estado;

    private String comentarioRrhh;
    private String comentarioTecnico;

    @Min(value = 0, message = "El puntaje técnico no puede ser negativo.")
    @Max(value = 100, message = "El puntaje técnico no puede superar 100.")
    private Integer puntajeTecnico;

    private String respuestasPostulante;
    private LocalDateTime fechaEvaluacion;
}
