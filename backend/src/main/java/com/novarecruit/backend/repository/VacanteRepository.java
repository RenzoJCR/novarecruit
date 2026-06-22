package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.Vacante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VacanteRepository extends JpaRepository<Vacante, Long> {

    List<Vacante> findAllByOrderByIdDesc();

    List<Vacante> findByEstadoOrderByFechaPublicacionDesc(String estado);

    List<Vacante> findByAreaIdOrderByFechaPublicacionDesc(Long areaId);
}