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
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotBlank(message = "Los nombres son obligatorios.")
    @Size(min = 2, max = 100, message = "Los nombres deben tener entre 2 y 100 caracteres.")
    @Column(name = "nombres", nullable = false, length = 100)
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios.")
    @Size(min = 2, max = 100, message = "Los apellidos deben tener entre 2 y 100 caracteres.")
    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos;

    @NotBlank(message = "El correo es obligatorio.")
    @Email(message = "El correo no tiene un formato válido.")
    @Size(max = 120, message = "El correo no puede superar los 120 caracteres.")
    @Column(name = "correo", nullable = false, unique = true, length = 120)
    private String correo;

    @NotBlank(message = "La contraseña es obligatoria.")
    @Size(min = 8, max = 255, message = "La contraseña debe tener entre 8 y 255 caracteres.")
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Size(max = 20, message = "El teléfono no puede superar los 20 caracteres.")
    @Column(name = "telefono", length = 20)
    private String telefono;

    @Size(max = 255, message = "La foto de perfil no puede superar los 255 caracteres.")
    @Column(name = "foto_perfil", length = 255)
    private String fotoPerfil;

    @Builder.Default
    @Column(name = "estado", nullable = false)
    private Boolean estado = true;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;

    @PrePersist
    public void prePersist() {
        if (estado == null) {
            estado = true;
        }

        if (fechaRegistro == null) {
            fechaRegistro = LocalDateTime.now();
        }

        trimFields();
    }

    @PreUpdate
    public void preUpdate() {
        trimFields();
    }

    private void trimFields() {
        if (nombres != null) {
            nombres = nombres.trim();
        }

        if (apellidos != null) {
            apellidos = apellidos.trim();
        }

        if (correo != null) {
            correo = correo.trim().toLowerCase();
        }

        if (telefono != null) {
            telefono = telefono.trim();
        }

        if (fotoPerfil != null) {
            fotoPerfil = fotoPerfil.trim();
        }
    }
}
