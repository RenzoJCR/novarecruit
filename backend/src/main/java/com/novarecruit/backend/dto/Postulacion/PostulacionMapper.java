package com.novarecruit.backend.dto.Postulacion;

import com.novarecruit.backend.entity.Postulacion;
import org.springframework.stereotype.Component;

@Component
public class PostulacionMapper {

    public PostulacionResponse toResponse(Postulacion postulacion) {
        if (postulacion == null) {
            return null;
        }

        return PostulacionResponse.builder()
                .id(postulacion.getId())
                .usuarioId(postulacion.getUsuario() != null ? postulacion.getUsuario().getId() : null)
                .usuarioNombreCompleto(postulacion.getUsuario() != null ? postulacion.getUsuario().getNombres() + " " + postulacion.getUsuario().getApellidos() : null)
                .vacanteId(postulacion.getVacante() != null ? postulacion.getVacante().getId() : null)
                .vacanteTitulo(postulacion.getVacante() != null ? postulacion.getVacante().getTitulo() : null)
                .estado(postulacion.getEstado())
                .fechaPostulacion(postulacion.getFechaPostulacion())
                .comentarioRrhh(postulacion.getComentarioRrhh())
                .comentarioTecnico(postulacion.getComentarioTecnico())
                .puntajeTecnico(postulacion.getPuntajeTecnico())
                .respuestasPostulante(postulacion.getRespuestasPostulante())
                .fechaEvaluacion(postulacion.getFechaEvaluacion())
                .build();
    }

    public Postulacion toEntity(PostulacionRequest request) {
        if (request == null) {
            return null;
        }

        return Postulacion.builder()
                .estado(request.getEstado() != null ? request.getEstado() : "POSTULADO")
                .comentarioRrhh(normalize(request.getComentarioRrhh()))
                .comentarioTecnico(normalize(request.getComentarioTecnico()))
                .puntajeTecnico(request.getPuntajeTecnico())
                .respuestasPostulante(normalize(request.getRespuestasPostulante()))
                .fechaEvaluacion(request.getFechaEvaluacion())
                .build();
    }

    public void updateEntity(Postulacion postulacion, PostulacionRequest request) {
        if (postulacion == null || request == null) {
            return;
        }

        if (request.getEstado() != null) {
            postulacion.setEstado(request.getEstado());
        }

        postulacion.setComentarioRrhh(normalize(request.getComentarioRrhh()));
        postulacion.setComentarioTecnico(normalize(request.getComentarioTecnico()));
        postulacion.setPuntajeTecnico(request.getPuntajeTecnico());
        postulacion.setRespuestasPostulante(normalize(request.getRespuestasPostulante()));
        postulacion.setFechaEvaluacion(request.getFechaEvaluacion());
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String normalizedValue = value.trim();
        return normalizedValue.isEmpty() ? null : normalizedValue;
    }
}
