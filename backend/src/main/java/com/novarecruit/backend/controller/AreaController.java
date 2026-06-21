package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.Area.AreaResponse;
import com.novarecruit.backend.dto.Area.AreaRequest;
import com.novarecruit.backend.service.AreaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/areas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AreaController {

    private final AreaService areaService;

    @GetMapping
    public List<AreaResponse> listarAreas() {
        return areaService.listarAreas();
    }

    @GetMapping("/{id}")
    public AreaResponse obtenerAreaPorId(@PathVariable Long id) {
        return areaService.obtenerAreaPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AreaResponse crearArea(@Valid @RequestBody AreaRequest request) {
        return areaService.crearArea(request);
    }

    @PutMapping("/{id}")
    public AreaResponse actualizarArea(
            @PathVariable Long id,
            @Valid @RequestBody AreaRequest request
    ) {
        return areaService.actualizarArea(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarArea(@PathVariable Long id) {
        areaService.eliminarArea(id);
    }
}