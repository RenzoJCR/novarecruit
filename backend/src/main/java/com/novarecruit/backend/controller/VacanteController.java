package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.Vacante.VacanteRequest;
import com.novarecruit.backend.dto.Vacante.VacanteResponse;
import com.novarecruit.backend.service.VacanteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vacantes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class VacanteController {

    private final VacanteService vacanteService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','RECURSOS_HUMANOS','LIDER_TECNICO','POSTULANTE')")
    public List<VacanteResponse> listarVacantes() {
        return vacanteService.listarVacantes();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','RECURSOS_HUMANOS','LIDER_TECNICO','POSTULANTE')")
    public VacanteResponse obtenerVacantePorId(@PathVariable Long id) {
        return vacanteService.obtenerVacantePorId(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','RECURSOS_HUMANOS')")
    @ResponseStatus(HttpStatus.CREATED)
    public VacanteResponse crearVacante(@Valid @RequestBody VacanteRequest request) {
        return vacanteService.crearVacante(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','RECURSOS_HUMANOS')")
    public VacanteResponse actualizarVacante(@PathVariable Long id, @Valid @RequestBody VacanteRequest request) {
        return vacanteService.actualizarVacante(id, request);
    }

    @PatchMapping("/{id}/cerrar")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','RECURSOS_HUMANOS')")
    public VacanteResponse cerrarVacante(@PathVariable Long id) {
        return vacanteService.cerrarVacante(id);
    }
}