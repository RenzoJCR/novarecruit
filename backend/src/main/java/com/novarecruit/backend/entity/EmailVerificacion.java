package com.novarecruit.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_verificaciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailVerificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "codigo", nullable = false, length = 10)
    private String codigo;

    @Column(name = "usado", nullable = false)
    private Boolean usado;

    @Column(name = "intentos", nullable = false)
    private Integer intentos;

    @Column(name = "fecha_expiracion", nullable = false)
    private LocalDateTime fechaExpiracion;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (usado == null) {
            usado = false;
        }

        if (intentos == null) {
            intentos = 0;
        }

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}