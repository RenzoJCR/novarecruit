import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  Save,
  Send,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { evaluacionPostulacionService } from "../../services/evaluacionPostulacionService.js";
import { evaluacionService } from "../../services/evaluacionService.js";

function getEstadoVisible(estado) {
  const labels = {
    ASIGNADA: "Pendiente",
    EN_PROCESO: "En proceso",
    COMPLETADA: "Enviada",
    REVISADA: "Revisada",
  };

  return labels[estado] || estado || "Sin estado";
}

function statusClass(estado) {
  const styles = {
    ASIGNADA: "bg-sky-50 text-sky-700 border-sky-200",
    EN_PROCESO: "bg-amber-50 text-amber-700 border-amber-200",
    COMPLETADA: "bg-violet-50 text-violet-700 border-violet-200",
    REVISADA: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return styles[estado] || "bg-slate-50 text-slate-600 border-slate-200";
}

function formatDateTime(value) {
  if (!value) return "Sin fecha";

  return new Date(value).toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function canAnswer(status) {
  return status === "ASIGNADA" || status === "EN_PROCESO";
}

function getQuestionsFromPayload(data) {
  return (
    data?.preguntas ||
    data?.evaluacion?.preguntas ||
    data?.evaluacionPreguntas ||
    data?.preguntasEvaluacion ||
    []
  );
}

function getOptionsFromQuestion(question) {
  return (
    question?.opciones ||
    question?.opcionesPregunta ||
    question?.alternativas ||
    []
  );
}

function getQuestionId(question) {
  return question.id || question.preguntaId || question.preguntaEvaluacionId;
}

function getQuestionText(question) {
  return question.enunciado || question.preguntaEnunciado || question.texto || "";
}

function getQuestionType(question) {
  return question.tipoPregunta || question.tipo || "TEXTO";
}

function getQuestionScore(question) {
  return question.puntaje || question.puntajeMaximo || 0;
}

function getOptionId(option) {
  return option.id || option.opcionId;
}

function getOptionText(option) {
  return option.texto || option.opcionTexto || option.descripcion || "";
}

function ApplicantEvaluationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [evaluation, setEvaluation] = useState(null);
  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const questions = useMemo(() => getQuestionsFromPayload(evaluation), [evaluation]);

  const answeredCount = useMemo(() => {
    return questions.filter((question) => {
      const questionId = getQuestionId(question);
      const type = getQuestionType(question);
      const value = answers[questionId];

      if (type === "TEXTO" || type === "CODIGO") {
        return Boolean(value?.respuestaTexto?.trim());
      }

      return Boolean(value?.opcionId);
    }).length;
  }, [questions, answers]);

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4500);
  };

  const buildInitialAnswers = (data, loadedQuestions) => {
    const initialAnswers = {};
    const previousAnswers = data.respuestas || [];

    loadedQuestions.forEach((question) => {
      const questionId = getQuestionId(question);
      const type = getQuestionType(question);

      const previousAnswer = previousAnswers.find((answer) => {
        return (
          Number(answer.preguntaId) === Number(questionId) ||
          Number(answer.preguntaEvaluacionId) === Number(questionId)
        );
      });

      if (type === "TEXTO" || type === "CODIGO") {
        initialAnswers[questionId] = {
          preguntaId: Number(questionId),
          respuestaTexto: previousAnswer?.respuestaTexto || "",
        };
      } else {
        initialAnswers[questionId] = {
          preguntaId: Number(questionId),
          opcionId: previousAnswer?.opcionId || "",
        };
      }
    });

    return initialAnswers;
  };

  const loadEvaluation = async () => {
    try {
      setLoading(true);

      const data = await evaluacionPostulacionService.getById(id);

      let loadedQuestions = getQuestionsFromPayload(data);
      let mergedData = data;

      if ((!loadedQuestions || loadedQuestions.length === 0) && data.evaluacionId) {
        const evaluacionBase = await evaluacionService.getById(data.evaluacionId);

        loadedQuestions = getQuestionsFromPayload(evaluacionBase);

        mergedData = {
          ...data,
          preguntas: loadedQuestions,
          duracionMinutos:
            data.duracionMinutos || evaluacionBase.duracionMinutos,
          puntajeMaximo: data.puntajeMaximo || evaluacionBase.puntajeMaximo,
          evaluacionTitulo:
            data.evaluacionTitulo || evaluacionBase.titulo,
        };
      }

      setEvaluation(mergedData);
      setAnswers(buildInitialAnswers(mergedData, loadedQuestions));
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo cargar la evaluación.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvaluation();
  }, [id]);

  const handleClosedAnswer = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        preguntaId: Number(questionId),
        opcionId: Number(optionId),
      },
    }));
  };

  const handleTextAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        preguntaId: Number(questionId),
        respuestaTexto: value,
      },
    }));
  };

  const validateAnswers = () => {
    if (!evaluation) return "No se encontró la evaluación.";

    if (!canAnswer(evaluation.estado)) {
      return "Esta evaluación ya fue enviada o revisada.";
    }

    if (questions.length === 0) {
      return "La evaluación no tiene preguntas registradas.";
    }

    for (let index = 0; index < questions.length; index++) {
      const question = questions[index];
      const questionId = getQuestionId(question);
      const type = getQuestionType(question);
      const answer = answers[questionId];

      if (type === "TEXTO" || type === "CODIGO") {
        if (!answer?.respuestaTexto?.trim()) {
          return `Responde la pregunta ${index + 1}.`;
        }
      } else if (!answer?.opcionId) {
        return `Selecciona una opción en la pregunta ${index + 1}.`;
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateAnswers();

    if (validationError) {
      showMessage(validationError, "error");
      return;
    }

    const confirmed = window.confirm(
      "¿Enviar evaluación? Luego de enviarla no podrás modificar tus respuestas."
    );

    if (!confirmed) return;

    const payload = {
      respuestas: questions.map((question) => {
        const questionId = getQuestionId(question);
        const type = getQuestionType(question);
        const answer = answers[questionId];

        if (type === "TEXTO" || type === "CODIGO") {
          return {
            preguntaId: Number(questionId),
            respuestaTexto: answer.respuestaTexto.trim(),
            opcionId: null,
          };
        }

        return {
          preguntaId: Number(questionId),
          opcionId: Number(answer.opcionId),
          respuestaTexto: null,
        };
      }),
    };

    try {
      setSending(true);

      await evaluacionPostulacionService.submit(id, payload);

      showMessage("Evaluación enviada correctamente.", "success");

      setTimeout(() => {
        navigate("/applicant/evaluaciones");
      }, 900);
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo enviar la evaluación.",
        "error"
      );
    } finally {
      setSending(false);
    }
  };

  const questionTypeLabel = (type) => {
    const labels = {
      MULTIPLE: "Opción múltiple",
      VERDADERO_FALSO: "Verdadero/Falso",
      TEXTO: "Texto",
      CODIGO: "Código",
    };

    return labels[type] || type;
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  if (loading) {
    return (
      <div>
        <SectionHeader
          title="Evaluación"
          description="Cargando información de la evaluación."
        />

        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-black text-slate-900">
            Cargando evaluación...
          </h2>
          <p className="text-slate-500 mt-1">Un momento por favor.</p>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div>
        <SectionHeader
          title="Evaluación no encontrada"
          description="No se pudo encontrar la evaluación solicitada."
        />

        <Link
          to="/applicant/evaluaciones"
          className="inline-flex items-center gap-2 text-sky-700 font-black"
        >
          <ArrowLeft size={18} />
          Volver a evaluaciones
        </Link>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Resolver evaluación"
        description="Lee cada pregunta con atención y envía tus respuestas al finalizar."
      />

      {message && (
        <div
          className={`mb-5 border rounded-2xl px-4 py-3 text-sm font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <Link
        to="/applicant/evaluaciones"
        className="inline-flex items-center gap-2 text-sky-700 font-black mb-5"
      >
        <ArrowLeft size={18} />
        Volver a evaluaciones
      </Link>

      <section className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <span
              className={`inline-flex px-3 py-1 rounded-full border text-xs font-black mb-3 ${statusClass(
                evaluation.estado
              )}`}
            >
              {getEstadoVisible(evaluation.estado)}
            </span>

            <h1 className="text-3xl font-black text-slate-900">
              {evaluation.evaluacionTitulo || evaluation.titulo}
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Vacante: <strong>{evaluation.vacanteTitulo}</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[260px]">
            <div className="border border-slate-200 rounded-xl p-3">
              <Clock size={17} className="text-sky-600" />
              <p className="text-sm font-black text-slate-900 mt-1">
                {evaluation.duracionMinutos || "-"} min
              </p>
              <p className="text-xs text-slate-500">Duración</p>
            </div>

            <div className="border border-slate-200 rounded-xl p-3">
              <BookOpenCheck size={17} className="text-sky-600" />
              <p className="text-sm font-black text-slate-900 mt-1">
                {answeredCount}/{questions.length}
              </p>
              <p className="text-xs text-slate-500">Respuestas</p>
            </div>
          </div>
        </div>

        <div className="mt-4 border border-slate-200 bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
          Asignada: {formatDateTime(evaluation.fechaAsignacion)}
          {evaluation.fechaEnvio && (
            <> · Enviada: {formatDateTime(evaluation.fechaEnvio)}</>
          )}
        </div>
      </section>

      {questions.length === 0 && (
        <section className="border border-amber-200 bg-amber-50 rounded-2xl p-5 mb-6">
          <p className="font-black text-amber-800">
            Esta evaluación no tiene preguntas cargadas.
          </p>
          <p className="text-sm text-amber-700 mt-1">
            Si la evaluación sí fue creada con preguntas, revisa que el backend
            esté devolviendo el campo <strong>evaluacionId</strong> en la
            asignación.
          </p>
        </section>
      )}

      {evaluation.estado === "REVISADA" && (
        <section className="border border-emerald-200 bg-emerald-50 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={22} className="text-emerald-700 shrink-0 mt-1" />
            <div>
              <h2 className="font-black text-slate-900">
                Evaluación revisada
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Puntaje obtenido:{" "}
                <strong>{evaluation.puntajeObtenido ?? "Pendiente"}</strong>
              </p>

              {evaluation.comentarioTecnico && (
                <p className="text-sm text-slate-600 mt-2">
                  Comentario: <strong>{evaluation.comentarioTecnico}</strong>
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <form className="space-y-4">
        {questions.map((question, index) => {
          const questionId = getQuestionId(question);
          const type = getQuestionType(question);
          const options = getOptionsFromQuestion(question);

          return (
            <section
              key={questionId}
              className="bg-white border border-slate-200 rounded-2xl p-5"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs font-black text-slate-500">
                    Pregunta {index + 1}
                  </p>

                  <h2 className="text-lg font-black text-slate-900 mt-1">
                    {getQuestionText(question)}
                  </h2>
                </div>

                <span className="inline-flex px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-black text-slate-600">
                  {questionTypeLabel(type)} · {getQuestionScore(question)} pts
                </span>
              </div>

              {type === "TEXTO" || type === "CODIGO" ? (
                <textarea
                  value={answers[questionId]?.respuestaTexto || ""}
                  onChange={(e) => handleTextAnswer(questionId, e.target.value)}
                  disabled={!canAnswer(evaluation.estado)}
                  placeholder={
                    type === "CODIGO"
                      ? "Escribe tu solución o fragmento de código..."
                      : "Escribe tu respuesta..."
                  }
                  className="w-full min-h-32 border border-slate-300 rounded-xl p-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100 disabled:text-slate-500"
                />
              ) : (
                <div className="space-y-2">
                  {options.map((option) => {
                    const optionId = getOptionId(option);

                    return (
                      <label
                        key={optionId}
                        className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer ${
                          Number(answers[questionId]?.opcionId) ===
                          Number(optionId)
                            ? "border-sky-300 bg-sky-50"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${questionId}`}
                          checked={
                            Number(answers[questionId]?.opcionId) ===
                            Number(optionId)
                          }
                          onChange={() => handleClosedAnswer(questionId, optionId)}
                          disabled={!canAnswer(evaluation.estado)}
                          className="accent-sky-600"
                        />

                        <span className="text-sm font-semibold text-slate-700">
                          {getOptionText(option)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}

        {canAnswer(evaluation.estado) && questions.length > 0 && (
          <section className="flex flex-col md:flex-row justify-end gap-3">
            <Link
              to="/applicant/evaluaciones"
              className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl text-sm font-black"
            >
              Cancelar
            </Link>

            <button
              type="button"
              disabled={sending}
              onClick={handleSubmit}
              className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white px-5 py-3 rounded-xl text-sm font-black"
            >
              <Send size={17} />
              {sending ? "Enviando..." : "Enviar evaluación"}
            </button>
          </section>
        )}

        {!canAnswer(evaluation.estado) && (
          <section className="flex justify-end">
            <Link
              to="/applicant/evaluaciones"
              className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl text-sm font-black"
            >
              <Save size={17} />
              Volver
            </Link>
          </section>
        )}
      </form>
    </div>
  );
}

export default ApplicantEvaluationDetail;