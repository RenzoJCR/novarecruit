package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.request.AsignarEvaluacionRequest;
import com.novarecruit.backend.dto.request.EnviarEvaluacionRequest;
import com.novarecruit.backend.dto.request.RespuestaPreguntaRequest;
import com.novarecruit.backend.dto.request.RevisionTecnicaRequest;
import com.novarecruit.backend.dto.response.EvaluacionPostulacionResponse;
import com.novarecruit.backend.dto.response.RespuestaEvaluacionResponse;
import com.novarecruit.backend.entity.*;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class EvaluacionPostulacionService {

    private final EvaluacionPostulacionRepository evaluacionPostulacionRepository;
    private final RespuestaEvaluacionRepository respuestaEvaluacionRepository;
    private final PreguntaEvaluacionRepository preguntaEvaluacionRepository;
    private final OpcionPreguntaRepository opcionPreguntaRepository;
    private final PostulacionRepository postulacionRepository;
    private final VacanteRepository vacanteRepository;
    private final EvaluacionService evaluacionService;
    private final LogSistemaService logSistemaService;
    private final NotificacionService notificacionService;

    @Transactional(readOnly = true)
    public List<EvaluacionPostulacionResponse> listarTodos() {
        return evaluacionPostulacionRepository.findAllByOrderByFechaAsignacionDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EvaluacionPostulacionResponse> listarPorPostulante(Long usuarioId) {
        return evaluacionPostulacionRepository.findByPostulacion_Usuario_IdOrderByFechaAsignacionDesc(usuarioId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EvaluacionPostulacionResponse> listarPorEstado(String estado) {
        return evaluacionPostulacionRepository.findByEstadoOrderByFechaAsignacionDesc(estado)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EvaluacionPostulacionResponse obtenerPorId(Long id) {
        return mapToResponse(buscarEvaluacionPostulacionPorId(id));
    }

    @Transactional
    public EvaluacionPostulacionResponse asignarEvaluacion(AsignarEvaluacionRequest request) {
        Postulacion postulacion = postulacionRepository.findById(request.getPostulacionId())
                .orElseThrow(() -> new BusinessException("No se encontró la postulación seleccionada."));

        if (!"APROBADO_RRHH".equals(postulacion.getEstado())) {
            throw new BusinessException("Solo se puede asignar evaluación a postulaciones aprobadas por RRHH.");
        }

        Evaluacion evaluacion = evaluacionService.buscarEvaluacionPorId(request.getEvaluacionId());

        if (!"ACTIVA".equals(evaluacion.getEstado())) {
            throw new BusinessException("La evaluación seleccionada no se encuentra activa.");
        }

        if (!evaluacion.getVacante().getId().equals(postulacion.getVacante().getId())) {
            throw new BusinessException("La evaluación no pertenece a la vacante de la postulación.");
        }

        if (evaluacionPostulacionRepository.existsByPostulacion_IdAndEvaluacion_Id(
                postulacion.getId(),
                evaluacion.getId()
        )) {
            throw new BusinessException("Esta evaluación ya fue asignada a la postulación.");
        }

        EvaluacionPostulacion evaluacionPostulacion = EvaluacionPostulacion.builder()
                .postulacion(postulacion)
                .evaluacion(evaluacion)
                .estado("ASIGNADA")
                .build();

        EvaluacionPostulacion guardada = evaluacionPostulacionRepository.save(evaluacionPostulacion);

        postulacion.setEstado("EVALUACION_PENDIENTE");
        postulacionRepository.save(postulacion);

        logSistemaService.registrarLog(
                evaluacion.getTecnico().getId(),
                "ASIGNAR_EVALUACION",
                "EVALUACIONES",
                "Se asignó la evaluación " + evaluacion.getTitulo()
                        + " al postulante " + postulacion.getUsuario().getCorreo(),
                "127.0.0.1"
        );

        notificacionService.crearNotificacion(
                postulacion.getUsuario().getId(),
                "Evaluación técnica asignada",
                "Se te asignó la evaluación técnica: " + evaluacion.getTitulo(),
                "EVALUACION",
                "/applicant/evaluaciones"
        );

        return mapToResponse(guardada);
    }

    @Transactional
    public EvaluacionPostulacionResponse enviarEvaluacion(EnviarEvaluacionRequest request) {
        EvaluacionPostulacion evaluacionPostulacion = buscarEvaluacionPostulacionPorId(request.getEvaluacionPostulacionId());

        if (!"ASIGNADA".equals(evaluacionPostulacion.getEstado()) &&
                !"EN_PROCESO".equals(evaluacionPostulacion.getEstado())) {
            throw new BusinessException("Esta evaluación no está disponible para ser enviada.");
        }

        List<PreguntaEvaluacion> preguntas = preguntaEvaluacionRepository
                .findByEvaluacion_IdOrderByOrdenAsc(evaluacionPostulacion.getEvaluacion().getId());

        if (request.getRespuestas().size() != preguntas.size()) {
            throw new BusinessException("Debes responder todas las preguntas de la evaluación.");
        }

        Map<Long, PreguntaEvaluacion> preguntasMap = preguntas.stream()
                .collect(java.util.stream.Collectors.toMap(PreguntaEvaluacion::getId, pregunta -> pregunta));

        Set<Long> preguntasRespondidas = new HashSet<>();
        BigDecimal puntajeTotal = BigDecimal.ZERO;

        for (RespuestaPreguntaRequest item : request.getRespuestas()) {
            if (!preguntasRespondidas.add(item.getPreguntaId())) {
                throw new BusinessException("No se puede responder la misma pregunta más de una vez.");
            }

            PreguntaEvaluacion pregunta = preguntasMap.get(item.getPreguntaId());

            if (pregunta == null) {
                throw new BusinessException("Una de las preguntas no pertenece a la evaluación asignada.");
            }

            RespuestaEvaluacion respuesta = procesarRespuesta(evaluacionPostulacion, pregunta, item);
            respuestaEvaluacionRepository.save(respuesta);

            if (respuesta.getPuntajeObtenido() != null) {
                puntajeTotal = puntajeTotal.add(respuesta.getPuntajeObtenido());
            }
        }

        evaluacionPostulacion.setEstado("COMPLETADA");
        evaluacionPostulacion.setFechaEnvio(LocalDateTime.now());
        evaluacionPostulacion.setPuntajeObtenido(puntajeTotal);

        EvaluacionPostulacion actualizada = evaluacionPostulacionRepository.save(evaluacionPostulacion);

        Postulacion postulacion = evaluacionPostulacion.getPostulacion();
        postulacion.setEstado("EVALUACION_COMPLETADA");
        postulacionRepository.save(postulacion);

        logSistemaService.registrarLog(
                postulacion.getUsuario().getId(),
                "ENVIAR_EVALUACION",
                "EVALUACIONES",
                "El postulante " + postulacion.getUsuario().getCorreo()
                        + " envió la evaluación: " + evaluacionPostulacion.getEvaluacion().getTitulo(),
                "127.0.0.1"
        );

        notificacionService.crearNotificacion(
                evaluacionPostulacion.getEvaluacion().getTecnico().getId(),
                "Evaluación completada",
                "El postulante " + postulacion.getUsuario().getCorreo()
                        + " completó la evaluación " + evaluacionPostulacion.getEvaluacion().getTitulo(),
                "EVALUACION",
                "/technical/resultados"
        );

        return mapToResponse(actualizada);
    }

    @Transactional
    public EvaluacionPostulacionResponse revisarResultadoTecnico(Long id, RevisionTecnicaRequest request) {
        EvaluacionPostulacion evaluacionPostulacion = buscarEvaluacionPostulacionPorId(id);

        if (!"COMPLETADA".equals(evaluacionPostulacion.getEstado())) {
            throw new BusinessException("Solo se pueden revisar evaluaciones completadas.");
        }

        BigDecimal puntajeMaximo = evaluacionPostulacion.getEvaluacion().getPuntajeMaximo();

        if (request.getPuntajeObtenido().compareTo(puntajeMaximo) > 0) {
            throw new BusinessException("El puntaje obtenido no puede superar el puntaje máximo.");
        }

        evaluacionPostulacion.setEstado("REVISADA");
        evaluacionPostulacion.setPuntajeObtenido(request.getPuntajeObtenido());
        evaluacionPostulacion.setComentarioTecnico(normalizarTextoOpcional(request.getComentarioTecnico()));

        EvaluacionPostulacion actualizada = evaluacionPostulacionRepository.save(evaluacionPostulacion);

        Postulacion postulacion = evaluacionPostulacion.getPostulacion();

        String nuevoEstado = Boolean.TRUE.equals(request.getAprobado())
                ? "APROBADO_TECNICO"
                : "RECHAZADO_TECNICO";

        postulacion.setEstado(nuevoEstado);
        postulacion.setPuntajeTecnico(request.getPuntajeObtenido());
        postulacion.setComentarioTecnico(normalizarTextoOpcional(request.getComentarioTecnico()));

        postulacionRepository.save(postulacion);

        logSistemaService.registrarLog(
                evaluacionPostulacion.getEvaluacion().getTecnico().getId(),
                nuevoEstado,
                "EVALUACIONES",
                "El líder técnico revisó la evaluación de "
                        + postulacion.getUsuario().getCorreo()
                        + " para la vacante: " + postulacion.getVacante().getTitulo(),
                "127.0.0.1"
        );

        notificacionService.crearNotificacion(
                postulacion.getUsuario().getId(),
                "Resultado técnico",
                Boolean.TRUE.equals(request.getAprobado())
                        ? "Tu evaluación técnica fue aprobada. Continúas en el proceso."
                        : "Tu evaluación técnica no fue aprobada.",
                "RESULTADO",
                "/applicant/postulaciones"
        );

        return mapToResponse(actualizada);
    }

    private RespuestaEvaluacion procesarRespuesta(
            EvaluacionPostulacion evaluacionPostulacion,
            PreguntaEvaluacion pregunta,
            RespuestaPreguntaRequest item
    ) {
        String tipo = pregunta.getTipoPregunta();

        if ("MULTIPLE".equals(tipo) || "VERDADERO_FALSO".equals(tipo)) {
            if (item.getOpcionId() == null) {
                throw new BusinessException("Debes seleccionar una opción para la pregunta: " + pregunta.getEnunciado());
            }

            OpcionPregunta opcion = opcionPreguntaRepository.findById(item.getOpcionId())
                    .orElseThrow(() -> new BusinessException("No se encontró una opción seleccionada."));

            if (!opcion.getPregunta().getId().equals(pregunta.getId())) {
                throw new BusinessException("Una opción seleccionada no pertenece a la pregunta correspondiente.");
            }

            Boolean esCorrecta = Boolean.TRUE.equals(opcion.getEsCorrecta());
            BigDecimal puntaje = esCorrecta ? pregunta.getPuntaje() : BigDecimal.ZERO;

            return RespuestaEvaluacion.builder()
                    .evaluacionPostulacion(evaluacionPostulacion)
                    .pregunta(pregunta)
                    .opcion(opcion)
                    .respuestaTexto(null)
                    .esCorrecta(esCorrecta)
                    .puntajeObtenido(puntaje)
                    .build();
        }

        if (item.getRespuestaTexto() == null || item.getRespuestaTexto().trim().isEmpty()) {
            throw new BusinessException("Debes ingresar una respuesta para la pregunta: " + pregunta.getEnunciado());
        }

        return RespuestaEvaluacion.builder()
                .evaluacionPostulacion(evaluacionPostulacion)
                .pregunta(pregunta)
                .opcion(null)
                .respuestaTexto(item.getRespuestaTexto().trim())
                .esCorrecta(null)
                .puntajeObtenido(BigDecimal.ZERO)
                .build();
    }

    private EvaluacionPostulacion buscarEvaluacionPostulacionPorId(Long id) {
        return evaluacionPostulacionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la evaluación asignada."));
    }

    private EvaluacionPostulacionResponse mapToResponse(EvaluacionPostulacion item) {
        List<RespuestaEvaluacionResponse> respuestas = respuestaEvaluacionRepository
                .findByEvaluacionPostulacion_Id(item.getId())
                .stream()
                .map(this::mapRespuestaToResponse)
                .toList();

        Postulacion postulacion = item.getPostulacion();
        Evaluacion evaluacion = item.getEvaluacion();

        return EvaluacionPostulacionResponse.builder()
                .id(item.getId())
                .postulacionId(postulacion.getId())
                .postulacionEstado(postulacion.getEstado())
                .esGanador(postulacion.getEsGanador())
                .evaluacionId(evaluacion.getId())
                .evaluacionTitulo(evaluacion.getTitulo())
                .vacanteId(postulacion.getVacante().getId())
                .vacanteTitulo(postulacion.getVacante().getTitulo())
                .postulanteId(postulacion.getUsuario().getId())
                .postulanteNombre(postulacion.getUsuario().getNombres() + " " + postulacion.getUsuario().getApellidos())
                .postulanteCorreo(postulacion.getUsuario().getCorreo())
                .estado(item.getEstado())
                .fechaAsignacion(item.getFechaAsignacion())
                .fechaEnvio(item.getFechaEnvio())
                .puntajeObtenido(item.getPuntajeObtenido())
                .comentarioTecnico(item.getComentarioTecnico())
                .respuestas(respuestas)
                .build();
    }

    private RespuestaEvaluacionResponse mapRespuestaToResponse(RespuestaEvaluacion respuesta) {
        return RespuestaEvaluacionResponse.builder()
                .id(respuesta.getId())
                .preguntaId(respuesta.getPregunta().getId())
                .preguntaEnunciado(respuesta.getPregunta().getEnunciado())
                .opcionId(respuesta.getOpcion() != null ? respuesta.getOpcion().getId() : null)
                .opcionTexto(respuesta.getOpcion() != null ? respuesta.getOpcion().getTexto() : null)
                .respuestaTexto(respuesta.getRespuestaTexto())
                .esCorrecta(respuesta.getEsCorrecta())
                .puntajeObtenido(respuesta.getPuntajeObtenido())
                .build();
    }

    private String normalizarTextoOpcional(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}