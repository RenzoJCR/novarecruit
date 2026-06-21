package com.novarecruit.backend.dto.PerfilPostulante;

import com.novarecruit.backend.entity.PerfilPostulante;
import org.springframework.stereotype.Component;

@Component
public class PerfilPostulanteMapper {

    public PerfilPostulanteResponse toResponse(PerfilPostulante perfil) {
        if (perfil == null) {
            return null;
        }

        return PerfilPostulanteResponse.builder()
                .id(perfil.getId())
                .usuarioId(perfil.getUsuario() != null ? perfil.getUsuario().getId() : null)
                .usuarioNombreCompleto(perfil.getUsuario() != null ? perfil.getUsuario().getNombres() + " " + perfil.getUsuario().getApellidos() : null)
                .usuarioCorreo(perfil.getUsuario() != null ? perfil.getUsuario().getCorreo() : null)
                .descripcion(perfil.getDescripcion())
                .experiencia(perfil.getExperiencia())
                .linkedin(perfil.getLinkedin())
                .github(perfil.getGithub())
                .cvUrl(perfil.getCvUrl())
                .fechaActualizacion(perfil.getFechaActualizacion())
                .build();
    }

    public PerfilPostulante toEntity(PerfilPostulanteRequest request) {
        if (request == null) {
            return null;
        }

        return PerfilPostulante.builder()
                .descripcion(normalize(request.getDescripcion()))
                .experiencia(normalize(request.getExperiencia()))
                .linkedin(normalize(request.getLinkedin()))
                .github(normalize(request.getGithub()))
                .cvUrl(normalize(request.getCvUrl()))
                .build();
    }

    public void updateEntity(PerfilPostulante perfil, PerfilPostulanteRequest request) {
        if (perfil == null || request == null) {
            return;
        }

        perfil.setDescripcion(normalize(request.getDescripcion()));
        perfil.setExperiencia(normalize(request.getExperiencia()));
        perfil.setLinkedin(normalize(request.getLinkedin()));
        perfil.setGithub(normalize(request.getGithub()));
        perfil.setCvUrl(normalize(request.getCvUrl()));
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String normalizedValue = value.trim();
        return normalizedValue.isEmpty() ? null : normalizedValue;
    }
}
