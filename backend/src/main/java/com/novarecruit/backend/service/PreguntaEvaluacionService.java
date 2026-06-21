package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.PreguntaEvaluacion.PreguntaEvaluacionMapper;
import com.novarecruit.backend.dto.PreguntaEvaluacion.PreguntaEvaluacionRequest;
import com.novarecruit.backend.dto.PreguntaEvaluacion.PreguntaEvaluacionResponse;
import com.novarecruit.backend.entity.Evaluacion;
import com.novarecruit.backend.entity.PreguntaEvaluacion;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.EvaluacionRepository;
import com.novarecruit.backend.repository.PreguntaEvaluacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PreguntaEvaluacionService {

    private final PreguntaEvaluacionRepository preguntaEvaluacionRepository;
    private final EvaluacionRepository evaluacionRepository;
    private final PreguntaEvaluacionMapper preguntaEvaluacionMapper;

    public List<PreguntaEvaluacionResponse> listarPreguntas() {
        return preguntaEvaluacionRepository.findAll()
                .stream()
                .map(preguntaEvaluacionMapper::toResponse)
                .toList();
    }

    public List<PreguntaEvaluacionResponse> listarPreguntasPorEvaluacion(Long evaluacionId) {
        return preguntaEvaluacionRepository.findAllByEvaluacionId(evaluacionId)
                .stream()
                .map(preguntaEvaluacionMapper::toResponse)
                .toList();
    }

    public PreguntaEvaluacionResponse obtenerPreguntaPorId(Long id) {
        return preguntaEvaluacionMapper.toResponse(buscarPreguntaPorId(id));
    }

    public PreguntaEvaluacionResponse crearPregunta(PreguntaEvaluacionRequest request) {
        Evaluacion evaluacion = buscarEvaluacionPorId(request.getEvaluacionId());
        PreguntaEvaluacion pregunta = preguntaEvaluacionMapper.toEntity(request);
        pregunta.setEvaluacion(evaluacion);

        return preguntaEvaluacionMapper.toResponse(preguntaEvaluacionRepository.save(pregunta));
    }

    public PreguntaEvaluacionResponse actualizarPregunta(Long id, PreguntaEvaluacionRequest request) {
        PreguntaEvaluacion pregunta = buscarPreguntaPorId(id);
        Evaluacion evaluacion = buscarEvaluacionPorId(request.getEvaluacionId());

        preguntaEvaluacionMapper.updateEntity(pregunta, request);
        pregunta.setEvaluacion(evaluacion);

        return preguntaEvaluacionMapper.toResponse(preguntaEvaluacionRepository.save(pregunta));
    }

    public void eliminarPregunta(Long id) {
        preguntaEvaluacionRepository.delete(buscarPreguntaPorId(id));
    }

    private PreguntaEvaluacion buscarPreguntaPorId(Long id) {
        return preguntaEvaluacionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la pregunta solicitada."));
    }

    private Evaluacion buscarEvaluacionPorId(Long id) {
        return evaluacionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la evaluación solicitada."));
    }
}
