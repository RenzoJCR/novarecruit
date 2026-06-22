package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Long> {

    Optional<Rol> findByNombreIgnoreCase(String nombre);

    List<Rol> findByEstadoTrueOrderByNombreAsc();

    List<Rol> findAllByOrderByIdAsc();
}