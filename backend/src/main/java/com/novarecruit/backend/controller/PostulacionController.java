package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.Postulacion.PostulacionRequest;
import com.novarecruit.backend.dto.Postulacion.PostulacionResponse;
import com.novarecruit.backend.service.PostulacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/postulaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PostulacionController {

    private final PostulacionService postulacionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','RECURSOS_HUMANOS','LIDER_TECNICO','POSTULANTE')")
    public List<PostulacionResponse> listarPostulaciones() {
        return postulacionService.listarPostulaciones();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','RECURSOS_HUMANOS','LIDER_TECNICO','POSTULANTE')")
    public PostulacionResponse obtenerPostulacionPorId(@PathVariable Long id) {
        return postulacionService.obtenerPostulacionPorId(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','POSTULANTE')")
    @ResponseStatus(HttpStatus.CREATED)
    public PostulacionResponse crearPostulacion(@Valid @RequestBody PostulacionRequest request) {
        return postulacionService.crearPostulacion(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','RECURSOS_HUMANOS')")
    public PostulacionResponse actualizarPostulacion(@PathVariable Long id, @Valid @RequestBody PostulacionRequest request) {
        return postulacionService.actualizarPostulacion(id, request);
    }
}