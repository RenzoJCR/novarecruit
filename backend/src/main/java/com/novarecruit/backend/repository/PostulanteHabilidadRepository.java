package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.PostulanteHabilidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostulanteHabilidadRepository extends JpaRepository<PostulanteHabilidad, Long> {

    List<PostulanteHabilidad> findByPostulacion_Id(Long postulacionId);
}