package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.response.LogSistemaResponse;
import com.novarecruit.backend.entity.LogSistema;
import com.novarecruit.backend.repository.LogSistemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LogSistemaService {

    private final LogSistemaRepository logSistemaRepository;

    public void registrarLog(Long usuarioId, String accion, String modulo, String descripcion, String ipOrigen) {
        LogSistema log = LogSistema.builder()
                .usuarioId(usuarioId)
                .accion(accion)
                .modulo(modulo)
                .descripcion(descripcion)
                .ipOrigen(ipOrigen)
                .build();

        logSistemaRepository.save(log);
    }

    public List<LogSistemaResponse> listarUltimosLogs() {
        return logSistemaRepository.findTop50ByOrderByFechaHoraDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private LogSistemaResponse mapToResponse(LogSistema log) {
        return LogSistemaResponse.builder()
                .id(log.getId())
                .usuarioId(log.getUsuarioId())
                .accion(log.getAccion())
                .modulo(log.getModulo())
                .descripcion(log.getDescripcion())
                .fechaHora(log.getFechaHora())
                .ipOrigen(log.getIpOrigen())
                .build();
    }
}