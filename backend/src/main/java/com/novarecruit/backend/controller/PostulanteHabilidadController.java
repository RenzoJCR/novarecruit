package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.PostulanteHabilidad.PostulanteHabilidadRequest;
import com.novarecruit.backend.dto.PostulanteHabilidad.PostulanteHabilidadResponse;
import com.novarecruit.backend.service.PostulanteHabilidadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/postulante-habilidades")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasAnyRole('ADMINISTRADOR','POSTULANTE')")
public class PostulanteHabilidadController {

    private final PostulanteHabilidadService postulanteHabilidadService;

    @GetMapping
    public List<PostulanteHabilidadResponse> listarRelaciones() {
        return postulanteHabilidadService.listarRelaciones();
    }

    @GetMapping("/{id}")
    public PostulanteHabilidadResponse obtenerRelacionPorId(@PathVariable Long id) {
        return postulanteHabilidadService.obtenerRelacionPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostulanteHabilidadResponse crearRelacion(@Valid @RequestBody PostulanteHabilidadRequest request) {
        return postulanteHabilidadService.crearRelacion(request);
    }

    @PutMapping("/{id}")
    public PostulanteHabilidadResponse actualizarRelacion(@PathVariable Long id, @Valid @RequestBody PostulanteHabilidadRequest request) {
        return postulanteHabilidadService.actualizarRelacion(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarRelacion(@PathVariable Long id) {
        postulanteHabilidadService.eliminarRelacion(id);
    }
}
