package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.Postulacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostulacionRepository extends JpaRepository<Postulacion, Long> {

    boolean existsByUsuarioIdAndVacanteId(Long usuarioId, Long vacanteId);
}
