package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.EvaluacionPostulacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvaluacionPostulacionRepository extends JpaRepository<EvaluacionPostulacion, Long> {

    boolean existsByPostulacion_IdAndEvaluacion_Id(Long postulacionId, Long evaluacionId);

    List<EvaluacionPostulacion> findAllByOrderByFechaAsignacionDesc();

    List<EvaluacionPostulacion> findByPostulacion_IdOrderByFechaAsignacionDesc(Long postulacionId);

    List<EvaluacionPostulacion> findByEvaluacion_IdOrderByFechaAsignacionDesc(Long evaluacionId);

    List<EvaluacionPostulacion> findByPostulacion_Usuario_IdOrderByFechaAsignacionDesc(Long usuarioId);

    List<EvaluacionPostulacion> findByEstadoOrderByFechaAsignacionDesc(String estado);
}