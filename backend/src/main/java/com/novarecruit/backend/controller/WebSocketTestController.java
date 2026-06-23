package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.response.NotificacionResponse;
import com.novarecruit.backend.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ws-test")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class WebSocketTestController {

    private final NotificacionService notificacionService;

    /*
     * Endpoint de prueba para demostrar el flujo completo:
     *
     * 1. Guarda una notificación en la BD.
     * 2. La envía por WebSocket/STOMP.
     * 3. El frontend la recibe y actualiza la vista.
     *
     * Ejemplo:
     * POST http://localhost:8080/api/ws-test/notificacion/4
     */
    @PostMapping("/notificacion/{usuarioId}")
    public NotificacionResponse enviarNotificacionDePrueba(
            @PathVariable Long usuarioId
    ) {
        return notificacionService.crearNotificacion(
                usuarioId,
                "Notificación en tiempo real",
                "Esta notificación fue guardada en BD y enviada mediante WebSocket/STOMP.",
                "SISTEMA",
                "/applicant/notificaciones"
        );
    }
}