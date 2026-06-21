package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.Habilidad.HabilidadRequest;
import com.novarecruit.backend.dto.Habilidad.HabilidadResponse;
import com.novarecruit.backend.service.HabilidadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habilidades")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class HabilidadController {

    private final HabilidadService habilidadService;

    @GetMapping
    public List<HabilidadResponse> listarHabilidades() {
        return habilidadService.listarHabilidades();
    }

    @GetMapping("/{id}")
    public HabilidadResponse obtenerHabilidadPorId(@PathVariable Long id) {
        return habilidadService.obtenerHabilidadPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HabilidadResponse crearHabilidad(@Valid @RequestBody HabilidadRequest request) {
        return habilidadService.crearHabilidad(request);
    }

    @PutMapping("/{id}")
    public HabilidadResponse actualizarHabilidad(@PathVariable Long id, @Valid @RequestBody HabilidadRequest request) {
        return habilidadService.actualizarHabilidad(id, request);
    }
}