package com.novarecruit.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "opciones_pregunta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpcionPregunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pregunta_id", nullable = false)
    private PreguntaEvaluacion pregunta;

    @Column(name = "texto", nullable = false, length = 255)
    private String texto;

    @Column(name = "es_correcta", nullable = false)
    private Boolean esCorrecta;
}