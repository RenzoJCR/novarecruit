package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.VacanteHabilidad.VacanteHabilidadMapper;
import com.novarecruit.backend.dto.VacanteHabilidad.VacanteHabilidadRequest;
import com.novarecruit.backend.dto.VacanteHabilidad.VacanteHabilidadResponse;
import com.novarecruit.backend.entity.Habilidad;
import com.novarecruit.backend.entity.Vacante;
import com.novarecruit.backend.entity.VacanteHabilidad;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.HabilidadRepository;
import com.novarecruit.backend.repository.VacanteHabilidadRepository;
import com.novarecruit.backend.repository.VacanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VacanteHabilidadService {

    private final VacanteHabilidadRepository vacanteHabilidadRepository;
    private final VacanteRepository vacanteRepository;
    private final HabilidadRepository habilidadRepository;
    private final VacanteHabilidadMapper vacanteHabilidadMapper;

    public List<VacanteHabilidadResponse> listarRelaciones() {
        return vacanteHabilidadRepository.findAll()
                .stream()
                .map(vacanteHabilidadMapper::toResponse)
                .toList();
    }

    public VacanteHabilidadResponse obtenerRelacionPorId(Long id) {
        return vacanteHabilidadMapper.toResponse(buscarRelacionPorId(id));
    }

    public VacanteHabilidadResponse crearRelacion(VacanteHabilidadRequest request) {
        Vacante vacante = buscarVacantePorId(request.getVacanteId());
        Habilidad habilidad = buscarHabilidadPorId(request.getHabilidadId());

        if (vacanteHabilidadRepository.existsByVacanteIdAndHabilidadId(vacante.getId(), habilidad.getId())) {
            throw new BusinessException("Ya existe esa habilidad asociada a la vacante.");
        }

        VacanteHabilidad entity = vacanteHabilidadMapper.toEntity(request);
        entity.setVacante(vacante);
        entity.setHabilidad(habilidad);

        return vacanteHabilidadMapper.toResponse(vacanteHabilidadRepository.save(entity));
    }

    public VacanteHabilidadResponse actualizarRelacion(Long id, VacanteHabilidadRequest request) {
        VacanteHabilidad entity = buscarRelacionPorId(id);
        Vacante vacante = buscarVacantePorId(request.getVacanteId());
        Habilidad habilidad = buscarHabilidadPorId(request.getHabilidadId());

        if (vacanteHabilidadRepository.existsByVacanteIdAndHabilidadIdAndIdNot(vacante.getId(), habilidad.getId(), id)) {
            throw new BusinessException("Ya existe otra relación con esa vacante y habilidad.");
        }

        vacanteHabilidadMapper.updateEntity(entity, request);
        entity.setVacante(vacante);
        entity.setHabilidad(habilidad);

        return vacanteHabilidadMapper.toResponse(vacanteHabilidadRepository.save(entity));
    }

    public void eliminarRelacion(Long id) {
        vacanteHabilidadRepository.delete(buscarRelacionPorId(id));
    }

    private VacanteHabilidad buscarRelacionPorId(Long id) {
        return vacanteHabilidadRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la relación solicitada."));
    }

    private Vacante buscarVacantePorId(Long id) {
        return vacanteRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la vacante solicitada."));
    }

    private Habilidad buscarHabilidadPorId(Long id) {
        return habilidadRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la habilidad solicitada."));
    }
}
