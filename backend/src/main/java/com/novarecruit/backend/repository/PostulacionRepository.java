package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.Postulacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostulacionRepository extends JpaRepository<Postulacion, Long> {

    boolean existsByUsuario_IdAndVacante_Id(Long usuarioId, Long vacanteId);

    List<Postulacion> findAllByOrderByFechaPostulacionDesc();

    List<Postulacion> findByVacante_Id(Long vacanteId);

    List<Postulacion> findByVacante_IdOrderByFechaPostulacionDesc(Long vacanteId);

    List<Postulacion> findByUsuario_IdOrderByFechaPostulacionDesc(Long usuarioId);

    List<Postulacion> findByEstadoOrderByFechaPostulacionDesc(String estado);
}