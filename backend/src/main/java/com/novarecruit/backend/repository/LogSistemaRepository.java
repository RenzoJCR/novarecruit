package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.LogSistema;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LogSistemaRepository extends JpaRepository<LogSistema, Long> {

    List<LogSistema> findTop50ByOrderByFechaHoraDesc();
}