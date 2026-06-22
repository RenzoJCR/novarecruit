package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.Habilidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HabilidadRepository extends JpaRepository<Habilidad, Long> {

    boolean existsByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);

    List<Habilidad> findByEstadoTrueOrderByNombreAsc();

    List<Habilidad> findAllByOrderByIdAsc();
}