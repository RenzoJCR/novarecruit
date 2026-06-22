package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.Evaluacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {

    List<Evaluacion> findAllByOrderByIdDesc();

    List<Evaluacion> findByVacante_IdOrderByCreatedAtDesc(Long vacanteId);

    List<Evaluacion> findByEstadoOrderByCreatedAtDesc(String estado);
}