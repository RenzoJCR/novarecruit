package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.response.NotificacionResponse;
import com.novarecruit.backend.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NotificacionController {

    private final NotificacionService notificacionService;

    @GetMapping("/usuario/{usuarioId}")
    public List<NotificacionResponse> listarPorUsuario(@PathVariable Long usuarioId) {
        return notificacionService.listarPorUsuario(usuarioId);
    }

    @GetMapping("/usuario/{usuarioId}/no-leidas")
    public List<NotificacionResponse> listarNoLeidasPorUsuario(@PathVariable Long usuarioId) {
        return notificacionService.listarNoLeidasPorUsuario(usuarioId);
    }

    @PatchMapping("/{id}/leer")
    public NotificacionResponse marcarComoLeida(@PathVariable Long id) {
        return notificacionService.marcarComoLeida(id);
    }
}