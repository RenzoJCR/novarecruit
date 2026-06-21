package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.PerfilPostulante.PerfilPostulanteMapper;
import com.novarecruit.backend.dto.PerfilPostulante.PerfilPostulanteRequest;
import com.novarecruit.backend.dto.PerfilPostulante.PerfilPostulanteResponse;
import com.novarecruit.backend.entity.PerfilPostulante;
import com.novarecruit.backend.entity.Rol;
import com.novarecruit.backend.entity.Usuario;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.PerfilPostulanteRepository;
import com.novarecruit.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PerfilPostulanteService {

    private static final String ROL_POSTULANTE = "POSTULANTE";

    private final PerfilPostulanteRepository perfilPostulanteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PerfilPostulanteMapper perfilPostulanteMapper;

    public List<PerfilPostulanteResponse> listarPerfiles() {
        return perfilPostulanteRepository.findAll()
                .stream()
                .map(perfilPostulanteMapper::toResponse)
                .toList();
    }

    public PerfilPostulanteResponse obtenerPerfilPorId(Long id) {
        return perfilPostulanteMapper.toResponse(buscarPerfilPorId(id));
    }

    public PerfilPostulanteResponse crearPerfil(PerfilPostulanteRequest request) {
        Usuario usuario = buscarPostulanteValido(request.getUsuarioId());

        if (perfilPostulanteRepository.findByUsuarioId(usuario.getId()).isPresent()) {
            throw new BusinessException("El usuario ya tiene un perfil de postulante registrado.");
        }

        PerfilPostulante perfil = perfilPostulanteMapper.toEntity(request);
        perfil.setUsuario(usuario);
        return perfilPostulanteMapper.toResponse(perfilPostulanteRepository.save(perfil));
    }

    public PerfilPostulanteResponse actualizarPerfil(Long id, PerfilPostulanteRequest request) {
        PerfilPostulante perfil = buscarPerfilPorId(id);
        Usuario usuario = buscarPostulanteValido(request.getUsuarioId());

        perfilPostulanteMapper.updateEntity(perfil, request);
        perfil.setUsuario(usuario);

        return perfilPostulanteMapper.toResponse(perfilPostulanteRepository.save(perfil));
    }

    private PerfilPostulante buscarPerfilPorId(Long id) {
        return perfilPostulanteRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró el perfil de postulante solicitado."));
    }

    private Usuario buscarPostulanteValido(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new BusinessException("No se encontró el usuario solicitado."));

        Rol rol = usuario.getRol();
        if (rol == null || rol.getNombre() == null || !ROL_POSTULANTE.equalsIgnoreCase(rol.getNombre())) {
            throw new BusinessException("El usuario seleccionado no tiene el rol de Postulante.");
        }

        if (Boolean.FALSE.equals(usuario.getEstado())) {
            throw new BusinessException("El usuario seleccionado está inactivo.");
        }

        return usuario;
    }
}
