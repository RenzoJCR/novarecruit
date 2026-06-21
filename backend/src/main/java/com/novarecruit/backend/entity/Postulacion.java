package com.novarecruit.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "postulaciones",
        uniqueConstraints = @UniqueConstraint(name = "uk_usuario_vacante", columnNames = {"usuario_id", "vacante_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Postulacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull(message = "El usuario es obligatorio.")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @NotNull(message = "La vacante es obligatoria.")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vacante_id", nullable = false)
    private Vacante vacante;

    @Builder.Default
    @NotBlank(message = "El estado es obligatorio.")
    @Pattern(
            regexp = "^(POSTULADO|EN_REVISION|ENTREVISTA|EVALUACION_TECNICA|RECHAZADO|ACEPTADO)$",
            message = "El estado de la postulación no es válido."
    )
    @Column(name = "estado", nullable = false, length = 50)
    private String estado = "POSTULADO";

    @Column(name = "fecha_postulacion", nullable = false, updatable = false)
    private LocalDateTime fechaPostulacion;

    @Column(name = "comentario_rrhh", columnDefinition = "TEXT")
    private String comentarioRrhh;

    @Column(name = "comentario_tecnico", columnDefinition = "TEXT")
    private String comentarioTecnico;

    @Min(value = 0, message = "El puntaje técnico no puede ser negativo.")
    @Max(value = 100, message = "El puntaje técnico no puede superar 100.")
    @Column(name = "puntaje_tecnico")
    private Integer puntajeTecnico;

    @Column(name = "respuestas_postulante", columnDefinition = "TEXT")
    private String respuestasPostulante;

    @Column(name = "fecha_evaluacion")
    private LocalDateTime fechaEvaluacion;

    @PrePersist
    public void prePersist() {
        if (fechaPostulacion == null) {
            fechaPostulacion = LocalDateTime.now();
        }

        if (estado == null || estado.isBlank()) {
            estado = "POSTULADO";
        }

        normalizeFields();
    }

    @PreUpdate
    public void preUpdate() {
        normalizeFields();
    }

    private void normalizeFields() {
        if (estado != null) {
            estado = estado.trim().toUpperCase();
        }

        if (comentarioRrhh != null) {
            comentarioRrhh = comentarioRrhh.trim();
        }

        if (comentarioTecnico != null) {
            comentarioTecnico = comentarioTecnico.trim();
        }

        if (respuestasPostulante != null) {
            respuestasPostulante = respuestasPostulante.trim();
        }
    }
}
