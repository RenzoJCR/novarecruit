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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "preguntas_evaluacion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreguntaEvaluacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "evaluacion_id", nullable = false)
    private Evaluacion evaluacion;

    @NotBlank(message = "El tipo de pregunta es obligatorio.")
    @Pattern(regexp = "^(MULTIPLE|VERDADERO_FALSO|TEXTO|CODIGO)$", message = "El tipo de pregunta no es válido.")
    @Column(name = "tipo_pregunta", nullable = false, length = 30)
    private String tipoPregunta;

    @NotBlank(message = "El enunciado es obligatorio.")
    @Column(name = "enunciado", nullable = false, columnDefinition = "TEXT")
    private String enunciado;

    @Column(name = "opcion_a", length = 255)
    private String opcionA;

    @Column(name = "opcion_b", length = 255)
    private String opcionB;

    @Column(name = "opcion_c", length = 255)
    private String opcionC;

    @Column(name = "opcion_d", length = 255)
    private String opcionD;

    @Column(name = "respuesta_correcta", columnDefinition = "TEXT")
    private String respuestaCorrecta;

    @PrePersist
    public void prePersist() {
        normalizeFields();
    }

    @PreUpdate
    public void preUpdate() {
        normalizeFields();
    }

    private void normalizeFields() {
        if (tipoPregunta != null) {
            tipoPregunta = tipoPregunta.trim().toUpperCase();
        }

        if (enunciado != null) {
            enunciado = enunciado.trim();
        }

        if (opcionA != null) {
            opcionA = opcionA.trim();
        }

        if (opcionB != null) {
            opcionB = opcionB.trim();
        }

        if (opcionC != null) {
            opcionC = opcionC.trim();
        }

        if (opcionD != null) {
            opcionD = opcionD.trim();
        }

        if (respuestaCorrecta != null) {
            respuestaCorrecta = respuestaCorrecta.trim();
        }
    }
}
