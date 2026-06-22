package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

    List<Notificacion> findByUsuarioIdOrderByCreatedAtDesc(Long usuarioId);

    List<Notificacion> findByUsuarioIdAndLeidoFalseOrderByCreatedAtDesc(Long usuarioId);
}