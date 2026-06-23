package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.request.EvaluacionRequest;
import com.novarecruit.backend.dto.response.EvaluacionResponse;
import com.novarecruit.backend.service.EvaluacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class EvaluacionController {

    private final EvaluacionService evaluacionService;

    @GetMapping
    public List<EvaluacionResponse> listarEvaluaciones() {
        return evaluacionService.listarEvaluaciones();
    }

    @GetMapping("/activas")
    public List<EvaluacionResponse> listarEvaluacionesActivas() {
        return evaluacionService.listarEvaluacionesActivas();
    }

    @GetMapping("/vacante/{vacanteId}")
    public List<EvaluacionResponse> listarPorVacante(@PathVariable Long vacanteId) {
        return evaluacionService.listarPorVacante(vacanteId);
    }

    @GetMapping("/{id}")
    public EvaluacionResponse obtenerPorId(@PathVariable Long id) {
        return evaluacionService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EvaluacionResponse crearEvaluacion(@Valid @RequestBody EvaluacionRequest request) {
        return evaluacionService.crearEvaluacion(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void desactivarEvaluacion(@PathVariable Long id) {
        evaluacionService.desactivarEvaluacion(id);
    }

    @PatchMapping("/{id}/reactivar")
    public EvaluacionResponse reactivarEvaluacion(@PathVariable Long id) {
        return evaluacionService.reactivarEvaluacion(id);
    }
}