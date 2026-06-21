package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.PreguntaEvaluacion.PreguntaEvaluacionRequest;
import com.novarecruit.backend.dto.PreguntaEvaluacion.PreguntaEvaluacionResponse;
import com.novarecruit.backend.service.PreguntaEvaluacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/preguntas-evaluacion")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasAnyRole('ADMINISTRADOR','LIDER_TECNICO')")
public class PreguntaEvaluacionController {

    private final PreguntaEvaluacionService preguntaEvaluacionService;

    @GetMapping
    public List<PreguntaEvaluacionResponse> listarPreguntas() {
        return preguntaEvaluacionService.listarPreguntas();
    }

    @GetMapping("/evaluacion/{evaluacionId}")
    public List<PreguntaEvaluacionResponse> listarPreguntasPorEvaluacion(@PathVariable Long evaluacionId) {
        return preguntaEvaluacionService.listarPreguntasPorEvaluacion(evaluacionId);
    }

    @GetMapping("/{id}")
    public PreguntaEvaluacionResponse obtenerPreguntaPorId(@PathVariable Long id) {
        return preguntaEvaluacionService.obtenerPreguntaPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PreguntaEvaluacionResponse crearPregunta(@Valid @RequestBody PreguntaEvaluacionRequest request) {
        return preguntaEvaluacionService.crearPregunta(request);
    }

    @PutMapping("/{id}")
    public PreguntaEvaluacionResponse actualizarPregunta(@PathVariable Long id, @Valid @RequestBody PreguntaEvaluacionRequest request) {
        return preguntaEvaluacionService.actualizarPregunta(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarPregunta(@PathVariable Long id) {
        preguntaEvaluacionService.eliminarPregunta(id);
    }
}
