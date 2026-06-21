package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.VacanteHabilidad.VacanteHabilidadRequest;
import com.novarecruit.backend.dto.VacanteHabilidad.VacanteHabilidadResponse;
import com.novarecruit.backend.service.VacanteHabilidadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vacante-habilidades")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasAnyRole('ADMINISTRADOR','RECURSOS_HUMANOS')")
public class VacanteHabilidadController {

    private final VacanteHabilidadService vacanteHabilidadService;

    @GetMapping
    public List<VacanteHabilidadResponse> listarRelaciones() {
        return vacanteHabilidadService.listarRelaciones();
    }

    @GetMapping("/{id}")
    public VacanteHabilidadResponse obtenerRelacionPorId(@PathVariable Long id) {
        return vacanteHabilidadService.obtenerRelacionPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VacanteHabilidadResponse crearRelacion(@Valid @RequestBody VacanteHabilidadRequest request) {
        return vacanteHabilidadService.crearRelacion(request);
    }

    @PutMapping("/{id}")
    public VacanteHabilidadResponse actualizarRelacion(@PathVariable Long id, @Valid @RequestBody VacanteHabilidadRequest request) {
        return vacanteHabilidadService.actualizarRelacion(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarRelacion(@PathVariable Long id) {
        vacanteHabilidadService.eliminarRelacion(id);
    }
}
