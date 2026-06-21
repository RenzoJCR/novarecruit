package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.Rol.RolRequest;
import com.novarecruit.backend.dto.Rol.RolResponse;
import com.novarecruit.backend.service.RolService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class RolController {

    private final RolService rolService;

    @GetMapping
    public List<RolResponse> listarRoles() {
        return rolService.listarRoles();
    }

    @GetMapping("/{id}")
    public RolResponse obtenerRolPorId(@PathVariable Long id) {
        return rolService.obtenerRolPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RolResponse crearRol(@Valid @RequestBody RolRequest request) {
        return rolService.crearRol(request);
    }

    @PutMapping("/{id}")
    public RolResponse actualizarRol(@PathVariable Long id, @Valid @RequestBody RolRequest request) {
        return rolService.actualizarRol(id, request);
    }
}