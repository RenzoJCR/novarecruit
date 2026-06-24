package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.request.HabilidadRequest;
import com.novarecruit.backend.dto.response.HabilidadResponse;
import com.novarecruit.backend.service.HabilidadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habilidades")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class HabilidadController {

    private final HabilidadService habilidadService;

    @GetMapping
    public List<HabilidadResponse> listarHabilidades() {
        return habilidadService.listarHabilidades();
    }

    @GetMapping("/activas")
    public List<HabilidadResponse> listarHabilidadesActivas() {
        return habilidadService.listarHabilidadesActivas();
    }

    @GetMapping("/{id}")
    public HabilidadResponse obtenerPorId(@PathVariable Long id) {
        return habilidadService.obtenerPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HabilidadResponse crearHabilidad(@Valid @RequestBody HabilidadRequest request) {
        return habilidadService.crearHabilidad(request);
    }

    @PutMapping("/{id}")
    public HabilidadResponse actualizarHabilidad(
            @PathVariable Long id,
            @Valid @RequestBody HabilidadRequest request
    ) {
        return habilidadService.actualizarHabilidad(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void desactivarHabilidad(@PathVariable Long id) {
        habilidadService.desactivarHabilidad(id);
    }

    @PatchMapping("/{id}/reactivar")
    public HabilidadResponse reactivarHabilidad(@PathVariable Long id) {
        return habilidadService.reactivarHabilidad(id);
    }
}