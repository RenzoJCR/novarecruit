package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.EmailVerificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmailVerificacionRepository extends JpaRepository<EmailVerificacion, Long> {

    Optional<EmailVerificacion> findTopByUsuario_IdAndUsadoFalseOrderByCreatedAtDesc(Long usuarioId);

    List<EmailVerificacion> findByUsuario_IdAndUsadoFalse(Long usuarioId);
}