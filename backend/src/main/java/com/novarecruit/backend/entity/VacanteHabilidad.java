package com.novarecruit.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vacante_habilidades")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VacanteHabilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vacante_id", nullable = false)
    private Vacante vacante;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habilidad_id", nullable = false)
    private Habilidad habilidad;

    @Column(name = "nivel_requerido", nullable = false, length = 50)
    private String nivelRequerido;

    @Column(name = "obligatorio", nullable = false)
    private Boolean obligatorio;
}