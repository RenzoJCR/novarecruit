import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  FileQuestion,
  Send,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { evaluacionService } from "../../services/evaluacionService.js";
import { evaluacionPostulacionService } from "../../services/evaluacionPostulacionService.js";

function ApplicantEvaluationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignedEvaluation, setAssignedEvaluation] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const questions = useMemo(() => evaluation?.preguntas || [], [evaluation]);

  const canSubmit = useMemo(() => {
    return (
      assignedEvaluation?.estado === "ASIGNADA" ||
      assignedEvaluation?.estado === "EN_PROCESO"
    );
  }, [assignedEvaluation]);

  const loadData = async () => {
    try {
      setLoading(true);

      const assignedData = await evaluacionPostulacionService.getById(id);
      setAssignedEvaluation(assignedData);

      const evaluationData = await evaluacionService.getById(
        assignedData.evaluacionId
      );
      setEvaluation(evaluationData);

      const initialAnswers = {};

      evaluationData.preguntas?.forEach((question) => {
        initialAnswers[question.id] = {
          preguntaId: question.id,
          opcionId: "",
          respuestaTexto: "",
        };
      });

      setAnswers(initialAnswers);
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
    loadData();
  }, [id]);

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4500);
  };

  const handleClosedAnswer = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        preguntaId: questionId,
        opcionId: Number(optionId),
        respuestaTexto: null,
      },
    }));
  };

  const handleTextAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        preguntaId: questionId,
        opcionId: null,
        respuestaTexto: value,
      },
    }));
  };

  const validateAnswers = () => {
    if (!canSubmit) {
      return "Esta evaluación ya no está disponible para ser enviada.";
    }

    for (const question of questions) {
      const answer = answers[question.id];

      if (!answer) {
        return "Debes responder todas las preguntas.";
      }

      if (
        question.tipoPregunta === "MULTIPLE" ||
        question.tipoPregunta === "VERDADERO_FALSO"
      ) {
        if (!answer.opcionId) {
          return `Debes seleccionar una opción para la pregunta ${question.orden}.`;
        }
      } else {
        if (!answer.respuestaTexto || !answer.respuestaTexto.trim()) {
          return `Debes ingresar una respuesta para la pregunta ${question.orden}.`;
        }
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

    const payload = {
      evaluacionPostulacionId: Number(id),
      respuestas: questions.map((question) => {
        const answer = answers[question.id];

        return {
          preguntaId: Number(question.id),
          opcionId: answer.opcionId ? Number(answer.opcionId) : null,
          respuestaTexto: answer.respuestaTexto || null,
        };
      }),
    };

    try {
      setSending(true);

      await evaluacionPostulacionService.submit(payload);

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

  const formatDateTime = (value) => {
    if (!value) return "Sin fecha";

    return new Date(value).toLocaleString("es-PE", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  const statusClass = (status) => {
    const styles = {
      ASIGNADA: "bg-sky-50 text-sky-700 border-sky-200",
      EN_PROCESO: "bg-amber-50 text-amber-700 border-amber-200",
      COMPLETADA: "bg-violet-50 text-violet-700 border-violet-200",
      REVISADA: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };

    return styles[status] || "bg-slate-50 text-slate-600 border-slate-200";
  };

  if (loading) {
    return (
      <div>
        <SectionHeader
          title="Resolver evaluación"
          description="Cargando evaluación asignada desde el backend."
        />

        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
          <h2 className="text-2xl font-black text-slate-900">
            Cargando evaluación...
          </h2>
        </div>
      </div>
    );
  }

  if (!assignedEvaluation || !evaluation) {
    return (
      <div>
        <SectionHeader
          title="Evaluación no encontrada"
          description="No se pudo cargar la información solicitada."
        />

        <Link
          to="/applicant/evaluaciones"
          className="inline-flex items-center gap-2 text-emerald-700 font-black"
        >
          <ArrowLeft size={18} />
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Resolver evaluación"
        description="Completa tus respuestas y envía la evaluación técnica."
      />

      {message && (
        <div
          className={`mb-5 border rounded-3xl px-5 py-4 font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <Link
        to="/applicant/evaluaciones"
        className="inline-flex items-center gap-2 text-emerald-700 font-black mb-6"
      >
        <ArrowLeft size={18} />
        Volver a evaluaciones
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        <section className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm">
            <span
              className={`inline-flex px-3 py-1 rounded-full border text-xs font-black mb-4 ${statusClass(
                assignedEvaluation.estado
              )}`}
            >
              {assignedEvaluation.estado}
            </span>

            <h1 className="text-4xl font-black text-slate-900">
              {evaluation.titulo}
            </h1>

            <p className="text-slate-500 mt-3">
              {evaluation.descripcion || "Sin descripción registrada."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-7">
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock size={18} className="text-emerald-600" />
                  <span className="font-bold">
                    {evaluation.duracionMinutos} min
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Duración</p>
              </div>

              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <BookOpenCheck size={18} className="text-emerald-600" />
                  <span className="font-bold">
                    {evaluation.puntajeMaximo} puntos
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Puntaje máximo</p>
              </div>

              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <FileQuestion size={18} className="text-emerald-600" />
                  <span className="font-bold">{questions.length}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Preguntas</p>
              </div>
            </div>
          </div>

          {questions.map((question) => (
            <div
              key={question.id}
              className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                <div>
                  <span className="inline-flex px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-black mb-3">
                    Pregunta {question.orden} · {question.tipoPregunta}
                  </span>

                  <h2 className="text-xl font-black text-slate-900">
                    {question.enunciado}
                  </h2>
                </div>

                <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black">
                  {question.puntaje} pts
                </span>
              </div>

              {(question.tipoPregunta === "MULTIPLE" ||
                question.tipoPregunta === "VERDADERO_FALSO") && (
                <div className="space-y-3">
                  {question.opciones?.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-colors ${
                        Number(answers[question.id]?.opcionId) ===
                        Number(option.id)
                          ? "bg-emerald-50 border-emerald-200"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.id}
                        checked={
                          Number(answers[question.id]?.opcionId) ===
                          Number(option.id)
                        }
                        disabled={!canSubmit}
                        onChange={(e) =>
                          handleClosedAnswer(question.id, e.target.value)
                        }
                        className="mt-1 accent-emerald-500"
                      />

                      <span className="font-semibold text-slate-700">
                        {option.texto}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {(question.tipoPregunta === "TEXTO" ||
                question.tipoPregunta === "CODIGO") && (
                <textarea
                  value={answers[question.id]?.respuestaTexto || ""}
                  disabled={!canSubmit}
                  onChange={(e) =>
                    handleTextAnswer(question.id, e.target.value)
                  }
                  placeholder={
                    question.tipoPregunta === "CODIGO"
                      ? "Escribe tu respuesta o fragmento de código..."
                      : "Escribe tu respuesta..."
                  }
                  className="w-full min-h-40 border border-slate-300 rounded-2xl p-4 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100 disabled:text-slate-500"
                />
              )}
            </div>
          ))}
        </section>

        <aside className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm h-fit">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center mb-5">
            <Send size={25} />
          </div>

          <h2 className="text-2xl font-black text-slate-900">
            Enviar evaluación
          </h2>

          <p className="text-slate-500 mt-2 text-sm">
            Al enviar, tus respuestas se guardarán en MySQL y el líder técnico
            podrá revisar el resultado.
          </p>

          <div className="mt-6 rounded-3xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs font-black text-slate-500">Vacante</p>
            <p className="font-black text-slate-900 mt-1">
              {assignedEvaluation.vacanteTitulo}
            </p>
          </div>

          <div className="mt-4 rounded-3xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs font-black text-slate-500">
              Fecha asignación
            </p>
            <p className="font-black text-slate-900 mt-1">
              {formatDateTime(assignedEvaluation.fechaAsignacion)}
            </p>
          </div>

          {assignedEvaluation.fechaEnvio && (
            <div className="mt-4 rounded-3xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-xs font-black text-slate-500">Fecha envío</p>
              <p className="font-black text-slate-900 mt-1">
                {formatDateTime(assignedEvaluation.fechaEnvio)}
              </p>
            </div>
          )}

          {canSubmit ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={sending}
              className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 disabled:from-slate-300 disabled:to-slate-300 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20 disabled:shadow-none"
            >
              <Send size={18} />
              {sending ? "Enviando..." : "Enviar evaluación"}
            </button>
          ) : (
            <div className="mt-7 rounded-3xl bg-emerald-50 border border-emerald-100 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={22}
                  className="text-emerald-600 shrink-0 mt-1"
                />
                <p className="text-sm text-slate-600">
                  Esta evaluación ya fue enviada o revisada. No se puede volver
                  a modificar.
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default ApplicantEvaluationDetail;