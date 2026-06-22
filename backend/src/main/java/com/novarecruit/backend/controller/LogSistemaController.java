package com.novarecruit.backend.controller;

import com.novarecruit.backend.dto.response.LogSistemaResponse;
import com.novarecruit.backend.service.LogSistemaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class LogSistemaController {

    private final LogSistemaService logSistemaService;

    @GetMapping
    public List<LogSistemaResponse> listarUltimosLogs() {
        return logSistemaService.listarUltimosLogs();
    }
}