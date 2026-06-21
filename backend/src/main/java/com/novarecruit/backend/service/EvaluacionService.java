package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.Evaluacion.EvaluacionMapper;
import com.novarecruit.backend.dto.Evaluacion.EvaluacionRequest;
import com.novarecruit.backend.dto.Evaluacion.EvaluacionResponse;
import com.novarecruit.backend.entity.Evaluacion;
import com.novarecruit.backend.entity.Vacante;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.EvaluacionRepository;
import com.novarecruit.backend.repository.VacanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EvaluacionService {

    private final EvaluacionRepository evaluacionRepository;
    private final VacanteRepository vacanteRepository;
    private final EvaluacionMapper evaluacionMapper;

    public List<EvaluacionResponse> listarEvaluaciones() {
        return evaluacionRepository.findAll()
                .stream()
                .map(evaluacionMapper::toResponse)
                .toList();
    }

    public EvaluacionResponse obtenerEvaluacionPorId(Long id) {
        return evaluacionMapper.toResponse(buscarEvaluacionPorId(id));
    }

    public EvaluacionResponse crearEvaluacion(EvaluacionRequest request) {
        Vacante vacante = buscarVacantePorId(request.getVacanteId());

        if (evaluacionRepository.existsByVacanteId(vacante.getId())) {
            throw new BusinessException("Ya existe una evaluación para esa vacante.");
        }

        Evaluacion evaluacion = evaluacionMapper.toEntity(request);
        evaluacion.setVacante(vacante);
        return evaluacionMapper.toResponse(evaluacionRepository.save(evaluacion));
    }

    public EvaluacionResponse actualizarEvaluacion(Long id, EvaluacionRequest request) {
        Evaluacion evaluacion = buscarEvaluacionPorId(id);
        Vacante vacante = buscarVacantePorId(request.getVacanteId());

        if (evaluacionRepository.existsByVacanteId(vacante.getId()) && !evaluacion.getVacante().getId().equals(vacante.getId())) {
            throw new BusinessException("Ya existe otra evaluación para esa vacante.");
        }

        evaluacionMapper.updateEntity(evaluacion, request);
        evaluacion.setVacante(vacante);
        return evaluacionMapper.toResponse(evaluacionRepository.save(evaluacion));
    }

    private Evaluacion buscarEvaluacionPorId(Long id) {
        return evaluacionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la evaluación solicitada."));
    }

    private Vacante buscarVacantePorId(Long id) {
        return vacanteRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la vacante solicitada."));
    }
}
