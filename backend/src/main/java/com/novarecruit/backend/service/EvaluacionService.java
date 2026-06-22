package com.novarecruit.backend.service;

import com.novarecruit.backend.dto.request.EvaluacionRequest;
import com.novarecruit.backend.dto.request.OpcionPreguntaRequest;
import com.novarecruit.backend.dto.request.PreguntaEvaluacionRequest;
import com.novarecruit.backend.dto.response.EvaluacionResponse;
import com.novarecruit.backend.dto.response.OpcionPreguntaResponse;
import com.novarecruit.backend.dto.response.PreguntaEvaluacionResponse;
import com.novarecruit.backend.entity.*;
import com.novarecruit.backend.exception.BusinessException;
import com.novarecruit.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class EvaluacionService {

    private static final Set<String> TIPOS_VALIDOS = Set.of("MULTIPLE", "VERDADERO_FALSO", "TEXTO", "CODIGO");

    private final EvaluacionRepository evaluacionRepository;
    private final PreguntaEvaluacionRepository preguntaEvaluacionRepository;
    private final OpcionPreguntaRepository opcionPreguntaRepository;
    private final VacanteRepository vacanteRepository;
    private final UsuarioRepository usuarioRepository;
    private final LogSistemaService logSistemaService;

    @Transactional(readOnly = true)
    public List<EvaluacionResponse> listarEvaluaciones() {
        return evaluacionRepository.findAllByOrderByIdDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EvaluacionResponse> listarEvaluacionesActivas() {
        return evaluacionRepository.findByEstadoOrderByCreatedAtDesc("ACTIVA")
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<EvaluacionResponse> listarPorVacante(Long vacanteId) {
        return evaluacionRepository.findByVacante_IdOrderByCreatedAtDesc(vacanteId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EvaluacionResponse obtenerPorId(Long id) {
        return mapToResponse(buscarEvaluacionPorId(id));
    }

    @Transactional
    public EvaluacionResponse crearEvaluacion(EvaluacionRequest request) {
        validarEvaluacionRequest(request);

        Vacante vacante = vacanteRepository.findById(request.getVacanteId())
                .orElseThrow(() -> new BusinessException("No se encontró la vacante seleccionada."));

        if ("CERRADA".equals(vacante.getEstado()) || "CANCELADA".equals(vacante.getEstado())) {
            throw new BusinessException("No se puede crear una evaluación para una vacante cerrada o cancelada.");
        }

        Usuario tecnico = usuarioRepository.findById(request.getTecnicoId())
                .orElseThrow(() -> new BusinessException("No se encontró el líder técnico seleccionado."));

        validarUsuarioTecnico(tecnico);

        Evaluacion evaluacion = Evaluacion.builder()
                .vacante(vacante)
                .tecnico(tecnico)
                .titulo(normalizarTexto(request.getTitulo()))
                .descripcion(normalizarTextoOpcional(request.getDescripcion()))
                .duracionMinutos(request.getDuracionMinutos())
                .puntajeMaximo(request.getPuntajeMaximo())
                .estado("ACTIVA")
                .build();

        Evaluacion evaluacionGuardada = evaluacionRepository.save(evaluacion);

        guardarPreguntas(evaluacionGuardada, request.getPreguntas());

        logSistemaService.registrarLog(
                tecnico.getId(),
                "CREAR_EVALUACION",
                "EVALUACIONES",
                "El líder técnico creó la evaluación: " + evaluacionGuardada.getTitulo()
                        + " para la vacante: " + vacante.getTitulo(),
                "127.0.0.1"
        );

        return mapToResponse(evaluacionGuardada);
    }

    @Transactional
    public void desactivarEvaluacion(Long id) {
        Evaluacion evaluacion = buscarEvaluacionPorId(id);

        if ("INACTIVA".equals(evaluacion.getEstado())) {
            throw new BusinessException("La evaluación ya se encuentra inactiva.");
        }

        evaluacion.setEstado("INACTIVA");
        evaluacionRepository.save(evaluacion);

        logSistemaService.registrarLog(
                evaluacion.getTecnico().getId(),
                "DESACTIVAR_EVALUACION",
                "EVALUACIONES",
                "Se desactivó la evaluación: " + evaluacion.getTitulo(),
                "127.0.0.1"
        );
    }

    public Evaluacion buscarEvaluacionPorId(Long id) {
        return evaluacionRepository.findById(id)
                .orElseThrow(() -> new BusinessException("No se encontró la evaluación solicitada."));
    }

    private void guardarPreguntas(Evaluacion evaluacion, List<PreguntaEvaluacionRequest> preguntasRequest) {
        Set<Integer> ordenesUsados = new HashSet<>();

        for (PreguntaEvaluacionRequest item : preguntasRequest) {
            String tipo = normalizarTexto(item.getTipoPregunta()).toUpperCase();

            if (!TIPOS_VALIDOS.contains(tipo)) {
                throw new BusinessException("Tipo de pregunta no válido: " + tipo);
            }

            if (!ordenesUsados.add(item.getOrden())) {
                throw new BusinessException("No se puede repetir el orden de las preguntas.");
            }

            PreguntaEvaluacion pregunta = PreguntaEvaluacion.builder()
                    .evaluacion(evaluacion)
                    .tipoPregunta(tipo)
                    .enunciado(normalizarTexto(item.getEnunciado()))
                    .puntaje(item.getPuntaje())
                    .orden(item.getOrden())
                    .build();

            PreguntaEvaluacion preguntaGuardada = preguntaEvaluacionRepository.save(pregunta);

            if ("MULTIPLE".equals(tipo) || "VERDADERO_FALSO".equals(tipo)) {
                guardarOpciones(preguntaGuardada, item.getOpciones());
            } else if (item.getOpciones() != null && !item.getOpciones().isEmpty()) {
                throw new BusinessException("Las preguntas de tipo TEXTO o CODIGO no deben tener opciones.");
            }
        }
    }

    private void guardarOpciones(PreguntaEvaluacion pregunta, List<OpcionPreguntaRequest> opcionesRequest) {
        if (opcionesRequest == null || opcionesRequest.size() < 2) {
            throw new BusinessException("Las preguntas de opción múltiple o verdadero/falso deben tener al menos dos opciones.");
        }

        long correctas = opcionesRequest.stream()
                .filter(opcion -> Boolean.TRUE.equals(opcion.getEsCorrecta()))
                .count();

        if (correctas != 1) {
            throw new BusinessException("Cada pregunta cerrada debe tener exactamente una opción correcta.");
        }

        for (OpcionPreguntaRequest item : opcionesRequest) {
            OpcionPregunta opcion = OpcionPregunta.builder()
                    .pregunta(pregunta)
                    .texto(normalizarTexto(item.getTexto()))
                    .esCorrecta(Boolean.TRUE.equals(item.getEsCorrecta()))
                    .build();

            opcionPreguntaRepository.save(opcion);
        }
    }

    private void validarEvaluacionRequest(EvaluacionRequest request) {
        BigDecimal totalPreguntas = request.getPreguntas()
                .stream()
                .map(PreguntaEvaluacionRequest::getPuntaje)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalPreguntas.compareTo(request.getPuntajeMaximo()) > 0) {
            throw new BusinessException("La suma de puntajes de preguntas no puede superar el puntaje máximo.");
        }
    }

    private void validarUsuarioTecnico(Usuario usuario) {
        if (Boolean.FALSE.equals(usuario.getEstado())) {
            throw new BusinessException("El líder técnico seleccionado se encuentra inactivo.");
        }

        if (!"LIDER_TECNICO".equalsIgnoreCase(usuario.getRol().getNombre())) {
            throw new BusinessException("El usuario seleccionado no tiene rol de líder técnico.");
        }
    }

    private EvaluacionResponse mapToResponse(Evaluacion evaluacion) {
        List<PreguntaEvaluacionResponse> preguntas = preguntaEvaluacionRepository
                .findByEvaluacion_IdOrderByOrdenAsc(evaluacion.getId())
                .stream()
                .map(this::mapPreguntaToResponse)
                .toList();

        return EvaluacionResponse.builder()
                .id(evaluacion.getId())
                .vacanteId(evaluacion.getVacante().getId())
                .vacanteTitulo(evaluacion.getVacante().getTitulo())
                .tecnicoId(evaluacion.getTecnico().getId())
                .tecnicoNombre(evaluacion.getTecnico().getNombres() + " " + evaluacion.getTecnico().getApellidos())
                .titulo(evaluacion.getTitulo())
                .descripcion(evaluacion.getDescripcion())
                .duracionMinutos(evaluacion.getDuracionMinutos())
                .puntajeMaximo(evaluacion.getPuntajeMaximo())
                .estado(evaluacion.getEstado())
                .createdAt(evaluacion.getCreatedAt())
                .preguntas(preguntas)
                .build();
    }

    private PreguntaEvaluacionResponse mapPreguntaToResponse(PreguntaEvaluacion pregunta) {
        List<OpcionPreguntaResponse> opciones = opcionPreguntaRepository.findByPregunta_Id(pregunta.getId())
                .stream()
                .map(this::mapOpcionToResponse)
                .toList();

        return PreguntaEvaluacionResponse.builder()
                .id(pregunta.getId())
                .tipoPregunta(pregunta.getTipoPregunta())
                .enunciado(pregunta.getEnunciado())
                .puntaje(pregunta.getPuntaje())
                .orden(pregunta.getOrden())
                .opciones(opciones)
                .build();
    }

    private OpcionPreguntaResponse mapOpcionToResponse(OpcionPregunta opcion) {
        return OpcionPreguntaResponse.builder()
                .id(opcion.getId())
                .texto(opcion.getTexto())
                .esCorrecta(opcion.getEsCorrecta())
                .build();
    }

    private String normalizarTexto(String value) {
        return value == null ? null : value.trim();
    }

    private String normalizarTextoOpcional(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }
}