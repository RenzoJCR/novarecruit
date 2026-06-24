package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.Habilidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HabilidadRepository extends JpaRepository<Habilidad, Long> {

    List<Habilidad> findAllByOrderByIdAsc();

    List<Habilidad> findByEstadoTrueOrderByNombreAsc();

    boolean existsByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);
}