package com.novarecruit.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "postulante_habilidades")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostulanteHabilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postulacion_id", nullable = false)
    private Postulacion postulacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habilidad_id", nullable = false)
    private Habilidad habilidad;

    @Column(name = "nivel_postulante", nullable = false, length = 50)
    private String nivelPostulante;

    @Column(name = "anios_experiencia")
    private Integer aniosExperiencia;
}