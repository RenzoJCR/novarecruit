package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.request.VacanteRequest;
import com.novarecruit.backend.dto.response.VacanteResponse;
import com.novarecruit.backend.service.VacanteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vacantes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class VacanteController {

    private final VacanteService vacanteService;

    @GetMapping
    public List<VacanteResponse> listarVacantes() {
        return vacanteService.listarVacantes();
    }

    @GetMapping("/activas")
    public List<VacanteResponse> listarVacantesActivas() {
        return vacanteService.listarVacantesActivas();
    }

    @GetMapping("/{id}")
    public VacanteResponse obtenerVacantePorId(@PathVariable Long id) {
        return vacanteService.obtenerVacantePorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VacanteResponse crearVacante(@Valid @RequestBody VacanteRequest request) {
        return vacanteService.crearVacante(request);
    }

    @PutMapping("/{id}")
    public VacanteResponse actualizarVacante(
            @PathVariable Long id,
            @Valid @RequestBody VacanteRequest request
    ) {
        return vacanteService.actualizarVacante(id, request);
    }

    @PatchMapping("/{vacanteId}/seleccionar-ganador/{postulacionId}")
    public VacanteResponse seleccionarGanador(
            @PathVariable Long vacanteId,
            @PathVariable Long postulacionId
    ) {
        return vacanteService.seleccionarGanador(vacanteId, postulacionId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelarVacante(@PathVariable Long id) {
        vacanteService.cancelarVacante(id);
    }
}