package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.VacanteHabilidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VacanteHabilidadRepository extends JpaRepository<VacanteHabilidad, Long> {

    List<VacanteHabilidad> findByVacanteId(Long vacanteId);

    void deleteByVacanteId(Long vacanteId);
}