package com.novarecruit.backend.entity;

import jakarta.persistence.*;
import lombok.*;

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
    private Long id;

    @Column(name = "nombres", nullable = false, length = 100)
    private String nombres;

    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos;

    @Column(name = "correo", nullable = false, unique = true, length = 120)
    private String correo;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "foto_perfil", length = 255)
    private String fotoPerfil;

    @Column(name = "estado", nullable = false)
    private Boolean estado;

    @Column(name = "correo_verificado", nullable = false)
    private Boolean correoVerificado;

    @Column(name = "debe_cambiar_password", nullable = false)
    private Boolean debeCambiarPassword;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;

    @PrePersist
    public void prePersist() {
        if (estado == null) {
            estado = true;
        }

        if (correoVerificado == null) {
            correoVerificado = false;
        }

        if (debeCambiarPassword == null) {
            debeCambiarPassword = false;
        }

        if (fechaRegistro == null) {
            fechaRegistro = LocalDateTime.now();
        }
    }
}