package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.Evaluacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EvaluacionRepository extends JpaRepository<Evaluacion, Long> {

    Optional<Evaluacion> findByVacanteId(Long vacanteId);

    boolean existsByVacanteId(Long vacanteId);
}
