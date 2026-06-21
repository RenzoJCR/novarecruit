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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "postulante_habilidades",
        uniqueConstraints = @UniqueConstraint(name = "uk_postulacion_habilidad", columnNames = {"postulacion_id", "habilidad_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostulanteHabilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "postulacion_id", nullable = false)
    private Postulacion postulacion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "habilidad_id", nullable = false)
    private Habilidad habilidad;

    @NotBlank(message = "El nivel del postulante es obligatorio.")
    @Pattern(regexp = "^(BASICO|INTERMEDIO|AVANZADO|EXPERTO)$", message = "El nivel del postulante debe ser BASICO, INTERMEDIO, AVANZADO o EXPERTO.")
    @Column(name = "nivel_postulante", nullable = false, length = 50)
    private String nivelPostulante;

    @Min(value = 0, message = "Los años de experiencia no pueden ser negativos.")
    @Column(name = "anios_experiencia")
    private Integer aniosExperiencia;

    @PrePersist
    public void prePersist() {
        if (nivelPostulante != null) {
            nivelPostulante = nivelPostulante.trim().toUpperCase();
        }
    }
}
