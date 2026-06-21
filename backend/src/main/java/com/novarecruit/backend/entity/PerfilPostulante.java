package com.novarecruit.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "perfiles_postulante")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerfilPostulante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "experiencia", columnDefinition = "TEXT")
    private String experiencia;

    @Size(max = 255, message = "El enlace de LinkedIn no puede superar los 255 caracteres.")
    @Column(name = "linkedin", length = 255)
    private String linkedin;

    @Size(max = 255, message = "El enlace de GitHub no puede superar los 255 caracteres.")
    @Column(name = "github", length = 255)
    private String github;

    @Size(max = 255, message = "La URL del CV no puede superar los 255 caracteres.")
    @Column(name = "cv_url", length = 255)
    private String cvUrl;

    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion;

    @PrePersist
    public void prePersist() {
        if (fechaActualizacion == null) {
            fechaActualizacion = LocalDateTime.now();
        }

        normalizarCampos();
    }

    @PreUpdate
    public void preUpdate() {
        fechaActualizacion = LocalDateTime.now();
        normalizarCampos();
    }

    private void normalizarCampos() {
        if (descripcion != null) {
            descripcion = descripcion.trim();
        }

        if (experiencia != null) {
            experiencia = experiencia.trim();
        }

        if (linkedin != null) {
            linkedin = linkedin.trim();
        }

        if (github != null) {
            github = github.trim();
        }

        if (cvUrl != null) {
            cvUrl = cvUrl.trim();
        }
    }
}
