package com.novarecruit.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "vacante_habilidades",
        uniqueConstraints = @UniqueConstraint(name = "uk_vacante_habilidad", columnNames = {"vacante_id", "habilidad_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VacanteHabilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vacante_id", nullable = false)
    private Vacante vacante;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "habilidad_id", nullable = false)
    private Habilidad habilidad;

    @NotBlank(message = "El nivel requerido es obligatorio.")
    @Pattern(regexp = "^(BASICO|INTERMEDIO|AVANZADO|EXPERTO)$", message = "El nivel requerido debe ser BASICO, INTERMEDIO, AVANZADO o EXPERTO.")
    @Column(name = "nivel_requerido", nullable = false, length = 50)
    private String nivelRequerido;
}
