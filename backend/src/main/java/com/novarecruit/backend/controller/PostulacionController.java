package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.request.PostulacionRequest;
import com.novarecruit.backend.dto.request.RevisionRrhhRequest;
import com.novarecruit.backend.dto.response.PostulacionResponse;
import com.novarecruit.backend.service.PostulacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/postulaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PostulacionController {

    private final PostulacionService postulacionService;

    @GetMapping
    public List<PostulacionResponse> listarPostulaciones() {
        return postulacionService.listarPostulaciones();
    }

    @GetMapping("/{id}")
    public PostulacionResponse obtenerPorId(@PathVariable Long id) {
        return postulacionService.obtenerPorId(id);
    }

    @GetMapping("/vacante/{vacanteId}")
    public List<PostulacionResponse> listarPorVacante(@PathVariable Long vacanteId) {
        return postulacionService.listarPorVacante(vacanteId);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<PostulacionResponse> listarPorUsuario(@PathVariable Long usuarioId) {
        return postulacionService.listarPorUsuario(usuarioId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostulacionResponse crearPostulacion(@Valid @RequestBody PostulacionRequest request) {
        return postulacionService.crearPostulacion(request);
    }

    @PatchMapping("/{id}/revision-rrhh")
    public PostulacionResponse revisarPorRrhh(
            @PathVariable Long id,
            @Valid @RequestBody RevisionRrhhRequest request
    ) {
        return postulacionService.revisarPorRrhh(id, request);
    }
}