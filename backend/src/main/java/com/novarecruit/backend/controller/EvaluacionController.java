package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.Evaluacion.EvaluacionRequest;
import com.novarecruit.backend.dto.Evaluacion.EvaluacionResponse;
import com.novarecruit.backend.service.EvaluacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EvaluacionController {

    private final EvaluacionService evaluacionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','LIDER_TECNICO','RECURSOS_HUMANOS')")
    public List<EvaluacionResponse> listarEvaluaciones() {
        return evaluacionService.listarEvaluaciones();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','LIDER_TECNICO','RECURSOS_HUMANOS','POSTULANTE')")
    public EvaluacionResponse obtenerEvaluacionPorId(@PathVariable Long id) {
        return evaluacionService.obtenerEvaluacionPorId(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','LIDER_TECNICO')")
    @ResponseStatus(HttpStatus.CREATED)
    public EvaluacionResponse crearEvaluacion(@Valid @RequestBody EvaluacionRequest request) {
        return evaluacionService.crearEvaluacion(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','LIDER_TECNICO')")
    public EvaluacionResponse actualizarEvaluacion(@PathVariable Long id, @Valid @RequestBody EvaluacionRequest request) {
        return evaluacionService.actualizarEvaluacion(id, request);
    }
}