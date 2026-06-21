package com.novarecruit.backend.controller.publico;

import com.novarecruit.backend.dto.Area.AreaResponse;
import com.novarecruit.backend.dto.Vacante.VacanteResponse;
import com.novarecruit.backend.service.AreaService;
import com.novarecruit.backend.service.VacanteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PublicVacanteController {

    private final VacanteService vacanteService;
    private final AreaService areaService;

    @GetMapping("/vacantes")
    public List<VacanteResponse> listarVacantesPublicas() {
        return vacanteService.listarVacantes();
    }

    @GetMapping("/areas")
    public List<AreaResponse> listarAreasPublicas() {
        return areaService.listarAreas();
    }
}