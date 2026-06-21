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
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vacantes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vacante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotBlank(message = "El título es obligatorio.")
    @Size(min = 3, max = 150, message = "El título debe tener entre 3 y 150 caracteres.")
    @Column(name = "titulo", nullable = false, length = 150)
    private String titulo;

    @NotBlank(message = "La descripción es obligatoria.")
    @Column(name = "descripcion", nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @NotBlank(message = "La modalidad es obligatoria.")
    @Pattern(regexp = "^(PRESENCIAL|REMOTO|HIBRIDO)$", message = "La modalidad debe ser PRESENCIAL, REMOTO o HIBRIDO.")
    @Column(name = "modalidad", nullable = false, length = 50)
    private String modalidad;

    @Size(max = 100, message = "La ubicación no puede superar los 100 caracteres.")
    @Column(name = "ubicacion", length = 100)
    private String ubicacion;

    @Positive(message = "El salario debe ser mayor a cero.")
    @Column(name = "salario", precision = 10, scale = 2)
    private BigDecimal salario;

    @Size(max = 50, message = "El nivel de experiencia no puede superar los 50 caracteres.")
    @Column(name = "nivel_experiencia", length = 50)
    private String nivelExperiencia;

    @Builder.Default
    @Pattern(regexp = "^(ACTIVA|CERRADA|CANCELADA)$", message = "El estado debe ser ACTIVA, CERRADA o CANCELADA.")
    @Column(name = "estado", nullable = false, length = 50)
    private String estado = "ACTIVA";

    @Column(name = "fecha_publicacion", nullable = false, updatable = false)
    private LocalDateTime fechaPublicacion;

    @FutureOrPresent(message = "La fecha de cierre debe ser hoy o una fecha futura.")
    @Column(name = "fecha_cierre")
    private LocalDate fechaCierre;

    @NotNull(message = "El área es obligatoria.")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id", nullable = false)
    private Area area;

    @NotNull(message = "El usuario de RRHH es obligatorio.")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rrhh_id", nullable = false)
    private Usuario rrhh;

    @PrePersist
    public void prePersist() {
        if (fechaPublicacion == null) {
            fechaPublicacion = LocalDateTime.now();
        }

        if (estado == null || estado.isBlank()) {
            estado = "ACTIVA";
        }

        normalizeFields();
    }

    @PreUpdate
    public void preUpdate() {
        normalizeFields();
    }

    private void normalizeFields() {
        if (titulo != null) {
            titulo = titulo.trim();
        }

        if (descripcion != null) {
            descripcion = descripcion.trim();
        }

        if (modalidad != null) {
            modalidad = modalidad.trim().toUpperCase();
        }

        if (ubicacion != null) {
            ubicacion = ubicacion.trim();
        }

        if (nivelExperiencia != null) {
            nivelExperiencia = nivelExperiencia.trim();
        }

        if (estado != null) {
            estado = estado.trim().toUpperCase();
        }
    }
}
