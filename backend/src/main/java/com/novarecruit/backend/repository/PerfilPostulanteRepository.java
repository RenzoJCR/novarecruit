package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.PerfilPostulante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PerfilPostulanteRepository extends JpaRepository<PerfilPostulante, Long> {

    Optional<PerfilPostulante> findByUsuarioId(Long usuarioId);
}
