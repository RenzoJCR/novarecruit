package com.novarecruit.backend.repository;

import com.novarecruit.backend.entity.OpcionPregunta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OpcionPreguntaRepository extends JpaRepository<OpcionPregunta, Long> {

    List<OpcionPregunta> findByPregunta_Id(Long preguntaId);
}