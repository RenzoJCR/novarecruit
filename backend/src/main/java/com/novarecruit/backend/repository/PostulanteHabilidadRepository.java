package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.PostulanteHabilidad;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostulanteHabilidadRepository extends JpaRepository<PostulanteHabilidad, Long> {

    boolean existsByPostulacionIdAndHabilidadId(Long postulacionId, Long habilidadId);

    boolean existsByPostulacionIdAndHabilidadIdAndIdNot(Long postulacionId, Long habilidadId, Long id);
}
