package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.PerfilPostulante.PerfilPostulanteRequest;
import com.novarecruit.backend.dto.PerfilPostulante.PerfilPostulanteResponse;
import com.novarecruit.backend.service.PerfilPostulanteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/perfiles-postulante")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PerfilPostulanteController {

    private final PerfilPostulanteService perfilPostulanteService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','RECURSOS_HUMANOS','LIDER_TECNICO')")
    public List<PerfilPostulanteResponse> listarPerfiles() {
        return perfilPostulanteService.listarPerfiles();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','RECURSOS_HUMANOS','LIDER_TECNICO','POSTULANTE')")
    public PerfilPostulanteResponse obtenerPerfilPorId(@PathVariable Long id) {
        return perfilPostulanteService.obtenerPerfilPorId(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','POSTULANTE')")
    @ResponseStatus(HttpStatus.CREATED)
    public PerfilPostulanteResponse crearPerfil(@Valid @RequestBody PerfilPostulanteRequest request) {
        return perfilPostulanteService.crearPerfil(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','POSTULANTE')")
    public PerfilPostulanteResponse actualizarPerfil(@PathVariable Long id, @Valid @RequestBody PerfilPostulanteRequest request) {
        return perfilPostulanteService.actualizarPerfil(id, request);
    }
}