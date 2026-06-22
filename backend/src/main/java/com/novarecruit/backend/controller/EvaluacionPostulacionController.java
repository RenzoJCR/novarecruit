package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.request.AsignarEvaluacionRequest;
import com.novarecruit.backend.dto.request.EnviarEvaluacionRequest;
import com.novarecruit.backend.dto.request.RevisionTecnicaRequest;
import com.novarecruit.backend.dto.response.EvaluacionPostulacionResponse;
import com.novarecruit.backend.service.EvaluacionPostulacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluaciones-postulacion")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EvaluacionPostulacionController {

    private final EvaluacionPostulacionService evaluacionPostulacionService;

    @GetMapping
    public List<EvaluacionPostulacionResponse> listarTodos() {
        return evaluacionPostulacionService.listarTodos();
    }

    @GetMapping("/{id}")
    public EvaluacionPostulacionResponse obtenerPorId(@PathVariable Long id) {
        return evaluacionPostulacionService.obtenerPorId(id);
    }

    @GetMapping("/postulante/{usuarioId}")
    public List<EvaluacionPostulacionResponse> listarPorPostulante(@PathVariable Long usuarioId) {
        return evaluacionPostulacionService.listarPorPostulante(usuarioId);
    }

    @GetMapping("/estado/{estado}")
    public List<EvaluacionPostulacionResponse> listarPorEstado(@PathVariable String estado) {
        return evaluacionPostulacionService.listarPorEstado(estado);
    }

    @PostMapping("/asignar")
    @ResponseStatus(HttpStatus.CREATED)
    public EvaluacionPostulacionResponse asignarEvaluacion(
            @Valid @RequestBody AsignarEvaluacionRequest request
    ) {
        return evaluacionPostulacionService.asignarEvaluacion(request);
    }

    @PostMapping("/enviar")
    public EvaluacionPostulacionResponse enviarEvaluacion(
            @Valid @RequestBody EnviarEvaluacionRequest request
    ) {
        return evaluacionPostulacionService.enviarEvaluacion(request);
    }

    @PatchMapping("/{id}/revision-tecnica")
    public EvaluacionPostulacionResponse revisarResultadoTecnico(
            @PathVariable Long id,
            @Valid @RequestBody RevisionTecnicaRequest request
    ) {
        return evaluacionPostulacionService.revisarResultadoTecnico(id, request);
    }
}