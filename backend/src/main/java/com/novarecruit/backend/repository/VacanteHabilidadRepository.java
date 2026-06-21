package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.VacanteHabilidad;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VacanteHabilidadRepository extends JpaRepository<VacanteHabilidad, Long> {

    boolean existsByVacanteIdAndHabilidadId(Long vacanteId, Long habilidadId);

    boolean existsByVacanteIdAndHabilidadIdAndIdNot(Long vacanteId, Long habilidadId, Long id);
}
