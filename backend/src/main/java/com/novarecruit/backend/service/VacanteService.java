package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.Vacante.VacanteMapper;
import com.novarecruit.backend.dto.Vacante.VacanteRequest;
import com.novarecruit.backend.dto.Vacante.VacanteResponse;
import com.novarecruit.backend.entity.Area;
import com.novarecruit.backend.entity.Rol;
import com.novarecruit.backend.entity.Usuario;
import com.novarecruit.backend.entity.Vacante;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.AreaRepository;
import com.novarecruit.backend.repository.UsuarioRepository;
import com.novarecruit.backend.repository.VacanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VacanteService {

    private static final String ROL_RRHH = "RECURSOS_HUMANOS";

    private final VacanteRepository vacanteRepository;
    private final AreaRepository areaRepository;
    private final UsuarioRepository usuarioRepository;
    private final VacanteMapper vacanteMapper;

    public List<VacanteResponse> listarVacantes() {
        return vacanteRepository.findAll()
                .stream()
                .map(vacanteMapper::toResponse)
                .toList();
    }

    public VacanteResponse obtenerVacantePorId(Long id) {
        return vacanteMapper.toResponse(buscarVacantePorId(id));
    }

    public VacanteResponse crearVacante(VacanteRequest request) {
        Vacante vacante = vacanteMapper.toEntity(request);
        vacante.setArea(buscarAreaPorId(request.getAreaId()));
        vacante.setRrhh(buscarRrhhValido(request.getRrhhId()));

        if (vacanteRepository.existsByTituloIgnoreCase(vacante.getTitulo())) {
            throw new BusinessException("Ya existe una vacante con ese título.");
        }

        return vacanteMapper.toResponse(vacanteRepository.save(vacante));
    }

    public VacanteResponse actualizarVacante(Long id, VacanteRequest request) {
        Vacante vacante = buscarVacantePorId(id);
        vacanteMapper.updateEntity(vacante, request);
        vacante.setArea(buscarAreaPorId(request.getAreaId()));
        vacante.setRrhh(buscarRrhhValido(request.getRrhhId()));

        if (vacanteRepository.existsByTituloIgnoreCaseAndIdNot(vacante.getTitulo(), id)) {
            throw new BusinessException("Ya existe otra vacante con ese título.");
        }

        return vacanteMapper.toResponse(vacanteRepository.save(vacante));
    }

    public VacanteResponse cerrarVacante(Long id) {
        Vacante vacante = buscarVacantePorId(id);
        vacante.setEstado("CERRADA");
        return vacanteMapper.toResponse(vacanteRepository.save(vacante));
    }

    private Vacante buscarVacantePorId(Long id) {
        return vacanteRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la vacante solicitada."));
    }

    private Area buscarAreaPorId(Long id) {
        return areaRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró el área solicitada."));
    }

    private Usuario buscarRrhhValido(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró el usuario de RRHH solicitado."));

        Rol rol = usuario.getRol();
        if (rol == null || rol.getNombre() == null || !ROL_RRHH.equalsIgnoreCase(rol.getNombre())) {
            throw new BusinessException("El usuario seleccionado no tiene el rol de Recursos Humanos.");
        }

        if (Boolean.FALSE.equals(usuario.getEstado())) {
            throw new BusinessException("El usuario de RRHH está inactivo.");
        }

        return usuario;
    }
}
