package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.Postulacion.PostulacionMapper;
import com.novarecruit.backend.dto.Postulacion.PostulacionRequest;
import com.novarecruit.backend.dto.Postulacion.PostulacionResponse;
import com.novarecruit.backend.entity.Rol;
import com.novarecruit.backend.entity.Usuario;
import com.novarecruit.backend.entity.Vacante;
import com.novarecruit.backend.entity.Postulacion;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.PostulacionRepository;
import com.novarecruit.backend.repository.UsuarioRepository;
import com.novarecruit.backend.repository.VacanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostulacionService {

    private static final String ROL_POSTULANTE = "POSTULANTE";

    private final PostulacionRepository postulacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final VacanteRepository vacanteRepository;
    private final PostulacionMapper postulacionMapper;

    public List<PostulacionResponse> listarPostulaciones() {
        return postulacionRepository.findAll()
                .stream()
                .map(postulacionMapper::toResponse)
                .toList();
    }

    public PostulacionResponse obtenerPostulacionPorId(Long id) {
        return postulacionMapper.toResponse(buscarPostulacionPorId(id));
    }

    public PostulacionResponse crearPostulacion(PostulacionRequest request) {
        Usuario usuario = buscarPostulanteValido(request.getUsuarioId());
        Vacante vacante = buscarVacantePorId(request.getVacanteId());

        if (postulacionRepository.existsByUsuarioIdAndVacanteId(usuario.getId(), vacante.getId())) {
            throw new BusinessException("El usuario ya tiene una postulación para esa vacante.");
        }

        Postulacion postulacion = postulacionMapper.toEntity(request);
        postulacion.setUsuario(usuario);
        postulacion.setVacante(vacante);

        return postulacionMapper.toResponse(postulacionRepository.save(postulacion));
    }

    public PostulacionResponse actualizarPostulacion(Long id, PostulacionRequest request) {
        Postulacion postulacion = buscarPostulacionPorId(id);
        Usuario usuario = buscarPostulanteValido(request.getUsuarioId());
        Vacante vacante = buscarVacantePorId(request.getVacanteId());

        postulacionMapper.updateEntity(postulacion, request);
        postulacion.setUsuario(usuario);
        postulacion.setVacante(vacante);

        return postulacionMapper.toResponse(postulacionRepository.save(postulacion));
    }

    private Postulacion buscarPostulacionPorId(Long id) {
        return postulacionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la postulación solicitada."));
    }

    private Usuario buscarPostulanteValido(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new BusinessException("No se encontró el usuario solicitado."));

        Rol rol = usuario.getRol();
        if (rol == null || rol.getNombre() == null || !ROL_POSTULANTE.equalsIgnoreCase(rol.getNombre())) {
            throw new BusinessException("El usuario seleccionado no tiene el rol de Postulante.");
        }

        if (Boolean.FALSE.equals(usuario.getEstado())) {
            throw new BusinessException("El usuario seleccionado está inactivo." );
        }

        return usuario;
    }

    private Vacante buscarVacantePorId(Long id) {
        return vacanteRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la vacante solicitada."));
    }
}
