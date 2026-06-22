package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.response.RolResponse;
import com.novarecruit.backend.service.RolService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class RolController {

    private final RolService rolService;

    @GetMapping
    public List<RolResponse> listarRoles() {
        return rolService.listarRoles();
    }

    @GetMapping("/activos")
    public List<RolResponse> listarRolesActivos() {
        return rolService.listarRolesActivos();
    }
}