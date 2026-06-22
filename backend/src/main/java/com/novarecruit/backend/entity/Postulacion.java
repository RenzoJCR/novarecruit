package com.novarecruit.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "postulaciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Postulacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vacante_id", nullable = false)
    private Vacante vacante;

    @Column(name = "estado", nullable = false, length = 50)
    private String estado;

    @Column(name = "fecha_postulacion", nullable = false, updatable = false)
    private LocalDateTime fechaPostulacion;

    @Column(name = "comentario_rrhh", columnDefinition = "TEXT")
    private String comentarioRrhh;

    @Column(name = "comentario_tecnico", columnDefinition = "TEXT")
    private String comentarioTecnico;

    @Column(name = "puntaje_tecnico", precision = 5, scale = 2)
    private BigDecimal puntajeTecnico;

    @Column(name = "es_ganador", nullable = false)
    private Boolean esGanador;

    @PrePersist
    public void prePersist() {
        if (estado == null) {
            estado = "POSTULADO";
        }

        if (fechaPostulacion == null) {
            fechaPostulacion = LocalDateTime.now();
        }

        if (esGanador == null) {
            esGanador = false;
        }
    }
}