package com.novarecruit.backend.service;

import com.novarecruit.backend.entity.Usuario;
import com.novarecruit.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminNotificationService {

    private final UsuarioRepository usuarioRepository;
    private final NotificacionService notificacionService;

    /*
     * Este servicio envía una notificación a todos los administradores activos.
     *
     * Se usa para eventos importantes del sistema, por ejemplo:
     * creación de usuarios, cambios en áreas o acciones administrativas.
     *
     * Cada administrador recibe su propia notificación porque el sistema
     * guarda la notificación con el usuarioId correspondiente.
     */
    @Transactional
    public void notificarAdministradores(
            String titulo,
            String mensaje,
            String tipo,
            String urlDestino
    ) {
        usuarioRepository.findAll()
                .stream()
                .filter(usuario -> Boolean.TRUE.equals(usuario.getEstado()))
                .filter(usuario -> usuario.getRol() != null)
                .filter(usuario -> "ADMINISTRADOR".equalsIgnoreCase(usuario.getRol().getNombre()))
                .forEach(admin -> notificacionService.crearNotificacion(
                        admin.getId(),
                        titulo,
                        mensaje,
                        tipo,
                        urlDestino
                ));
    }
}