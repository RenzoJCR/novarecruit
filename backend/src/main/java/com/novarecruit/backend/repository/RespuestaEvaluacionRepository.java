package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.RespuestaEvaluacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RespuestaEvaluacionRepository extends JpaRepository<RespuestaEvaluacion, Long> {

    List<RespuestaEvaluacion> findByEvaluacionPostulacion_Id(Long evaluacionPostulacionId);
}