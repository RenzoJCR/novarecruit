package com.novarecruit.backend.entity;

import jakarta.persistence.*;
import lombok.*;

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
    private Long id;

    @Column(name = "titulo", nullable = false, length = 150)
    private String titulo;

    @Column(name = "descripcion", nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "modalidad", nullable = false, length = 50)
    private String modalidad;

    @Column(name = "ubicacion", length = 100)
    private String ubicacion;

    @Column(name = "salario", precision = 10, scale = 2)
    private BigDecimal salario;

    @Column(name = "nivel_experiencia", length = 50)
    private String nivelExperiencia;

    @Column(name = "estado", nullable = false, length = 50)
    private String estado;

    @Column(name = "fecha_publicacion", nullable = false, updatable = false)
    private LocalDateTime fechaPublicacion;

    @Column(name = "fecha_cierre")
    private LocalDate fechaCierre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id", nullable = false)
    private Area area;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rrhh_id", nullable = false)
    private Usuario rrhh;

    @Column(name = "postulacion_ganadora_id")
    private Long postulacionGanadoraId;

    @PrePersist
    public void prePersist() {
        if (estado == null) {
            estado = "ACTIVA";
        }

        if (fechaPublicacion == null) {
            fechaPublicacion = LocalDateTime.now();
        }
    }
}