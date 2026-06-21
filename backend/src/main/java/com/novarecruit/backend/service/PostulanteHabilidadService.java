package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.PostulanteHabilidad.PostulanteHabilidadMapper;
import com.novarecruit.backend.dto.PostulanteHabilidad.PostulanteHabilidadRequest;
import com.novarecruit.backend.dto.PostulanteHabilidad.PostulanteHabilidadResponse;
import com.novarecruit.backend.entity.Habilidad;
import com.novarecruit.backend.entity.Postulacion;
import com.novarecruit.backend.entity.PostulanteHabilidad;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.HabilidadRepository;
import com.novarecruit.backend.repository.PostulacionRepository;
import com.novarecruit.backend.repository.PostulanteHabilidadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostulanteHabilidadService {

    private final PostulanteHabilidadRepository postulanteHabilidadRepository;
    private final PostulacionRepository postulacionRepository;
    private final HabilidadRepository habilidadRepository;
    private final PostulanteHabilidadMapper postulanteHabilidadMapper;

    public List<PostulanteHabilidadResponse> listarRelaciones() {
        return postulanteHabilidadRepository.findAll()
                .stream()
                .map(postulanteHabilidadMapper::toResponse)
                .toList();
    }

    public PostulanteHabilidadResponse obtenerRelacionPorId(Long id) {
        return postulanteHabilidadMapper.toResponse(buscarRelacionPorId(id));
    }

    public PostulanteHabilidadResponse crearRelacion(PostulanteHabilidadRequest request) {
        Postulacion postulacion = buscarPostulacionPorId(request.getPostulacionId());
        Habilidad habilidad = buscarHabilidadPorId(request.getHabilidadId());

        if (postulanteHabilidadRepository.existsByPostulacionIdAndHabilidadId(postulacion.getId(), habilidad.getId())) {
            throw new BusinessException("Ya existe esa habilidad para la postulación.");
        }

        PostulanteHabilidad entity = postulanteHabilidadMapper.toEntity(request);
        entity.setPostulacion(postulacion);
        entity.setHabilidad(habilidad);

        return postulanteHabilidadMapper.toResponse(postulanteHabilidadRepository.save(entity));
    }

    public PostulanteHabilidadResponse actualizarRelacion(Long id, PostulanteHabilidadRequest request) {
        PostulanteHabilidad entity = buscarRelacionPorId(id);
        Postulacion postulacion = buscarPostulacionPorId(request.getPostulacionId());
        Habilidad habilidad = buscarHabilidadPorId(request.getHabilidadId());

        if (postulanteHabilidadRepository.existsByPostulacionIdAndHabilidadIdAndIdNot(postulacion.getId(), habilidad.getId(), id)) {
            throw new BusinessException("Ya existe otra relación con esa postulación y habilidad.");
        }

        postulanteHabilidadMapper.updateEntity(entity, request);
        entity.setPostulacion(postulacion);
        entity.setHabilidad(habilidad);

        return postulanteHabilidadMapper.toResponse(postulanteHabilidadRepository.save(entity));
    }

    public void eliminarRelacion(Long id) {
        postulanteHabilidadRepository.delete(buscarRelacionPorId(id));
    }

    private PostulanteHabilidad buscarRelacionPorId(Long id) {
        return postulanteHabilidadRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la relación solicitada."));
    }

    private Postulacion buscarPostulacionPorId(Long id) {
        return postulacionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la postulación solicitada."));
    }

    private Habilidad buscarHabilidadPorId(Long id) {
        return habilidadRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la habilidad solicitada."));
    }
}
