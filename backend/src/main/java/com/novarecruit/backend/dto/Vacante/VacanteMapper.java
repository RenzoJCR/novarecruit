package com.novarecruit.backend.dto.Vacante;

import com.novarecruit.backend.entity.Vacante;
import org.springframework.stereotype.Component;

@Component
public class VacanteMapper {

    public VacanteResponse toResponse(Vacante vacante) {
        if (vacante == null) {
            return null;
        }

        return VacanteResponse.builder()
                .id(vacante.getId())
                .titulo(vacante.getTitulo())
                .descripcion(vacante.getDescripcion())
                .modalidad(vacante.getModalidad())
                .ubicacion(vacante.getUbicacion())
                .salario(vacante.getSalario())
                .nivelExperiencia(vacante.getNivelExperiencia())
                .estado(vacante.getEstado())
                .fechaPublicacion(vacante.getFechaPublicacion())
                .fechaCierre(vacante.getFechaCierre())
                .areaId(vacante.getArea() != null ? vacante.getArea().getId() : null)
                .areaNombre(vacante.getArea() != null ? vacante.getArea().getNombre() : null)
                .rrhhId(vacante.getRrhh() != null ? vacante.getRrhh().getId() : null)
                .rrhhNombre(vacante.getRrhh() != null ? vacante.getRrhh().getNombres() + " " + vacante.getRrhh().getApellidos() : null)
                .rrhhRolNombre(vacante.getRrhh() != null && vacante.getRrhh().getRol() != null ? vacante.getRrhh().getRol().getNombre() : null)
                .build();
    }

    public Vacante toEntity(VacanteRequest request) {
        if (request == null) {
            return null;
        }

        return Vacante.builder()
                .titulo(normalize(request.getTitulo()))
                .descripcion(normalize(request.getDescripcion()))
                .modalidad(normalizeUpper(request.getModalidad()))
                .ubicacion(normalize(request.getUbicacion()))
                .salario(request.getSalario())
                .nivelExperiencia(normalize(request.getNivelExperiencia()))
                .estado(request.getEstado() != null ? normalizeUpper(request.getEstado()) : "ACTIVA")
                .fechaCierre(request.getFechaCierre())
                .build();
    }

    public void updateEntity(Vacante vacante, VacanteRequest request) {
        if (vacante == null || request == null) {
            return;
        }

        vacante.setTitulo(normalize(request.getTitulo()));
        vacante.setDescripcion(normalize(request.getDescripcion()));
        vacante.setModalidad(normalizeUpper(request.getModalidad()));
        vacante.setUbicacion(normalize(request.getUbicacion()));
        vacante.setSalario(request.getSalario());
        vacante.setNivelExperiencia(normalize(request.getNivelExperiencia()));

        if (request.getEstado() != null) {
            vacante.setEstado(normalizeUpper(request.getEstado()));
        }

        vacante.setFechaCierre(request.getFechaCierre());
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String normalizedValue = value.trim();
        return normalizedValue.isEmpty() ? null : normalizedValue;
    }

    private String normalizeUpper(String value) {
        String normalizedValue = normalize(value);
        return normalizedValue != null ? normalizedValue.toUpperCase() : null;
    }
}
