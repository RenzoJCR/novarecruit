package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.PreguntaEvaluacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PreguntaEvaluacionRepository extends JpaRepository<PreguntaEvaluacion, Long> {

    List<PreguntaEvaluacion> findAllByEvaluacionId(Long evaluacionId);

    long countByEvaluacionId(Long evaluacionId);
}
