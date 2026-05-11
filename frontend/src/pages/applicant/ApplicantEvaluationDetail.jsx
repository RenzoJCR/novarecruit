import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, ClipboardList, Send } from "lucide-react";

import { useData } from "../../context/DataContext.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";

const fallbackQuestions = [
  {
    id: 1,
    question: "¿Cuál es la función principal de React en una aplicación web?",
    type: "Opción múltiple",
    options: [
      "Gestionar bases de datos",
      "Construir interfaces de usuario",
      "Compilar código Java",
      "Administrar servidores",
    ],
  },
  {
    id: 2,
    question: "Explica brevemente qué es un componente reutilizable.",
    type: "Texto",
    options: [],
  },
  {
    id: 3,
    question: "¿Para qué se utiliza el estado en React?",
    type: "Opción múltiple",
    options: [
      "Para guardar información que puede cambiar en la interfaz",
      "Para diseñar únicamente estilos CSS",
      "Para crear bases de datos",
      "Para reemplazar HTML completamente",
    ],
  },
];

function ApplicantEvaluationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { evaluations, submitApplicantEvaluation } = useData();

  const evaluation = evaluations.find((item) => item.id === Number(id));

  const questions = useMemo(() => {
    if (evaluation?.questionList?.length > 0) {
      return evaluation.questionList.map((item, index) => ({
        id: item.id || index + 1,
        question: item.question,
        type: item.type,
        options:
          item.type === "Verdadero/Falso"
            ? ["Verdadero", "Falso"]
            : item.options || [],
      }));
    }

    return fallbackQuestions;
  }, [evaluation]);

  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    const answeredQuestions = Object.values(answers).filter((answer) => {
      if (typeof answer !== "string") return false;
      return answer.trim() !== "";
    });

    if (answeredQuestions.length < questions.length) {
      setMessage("Responde todas las preguntas antes de enviar la evaluación.");
      setMessageType("error");
      return;
    }

    const result = submitApplicantEvaluation(evaluation.id);
    setMessage(result.message);
    setMessageType(result.ok ? "success" : "error");

    if (result.ok) {
      setTimeout(() => {
        navigate("/applicant/evaluaciones");
      }, 900);
    }
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  if (!evaluation) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Evaluación no encontrada
        </h2>

        <p className="text-slate-500 mt-2">
          La evaluación seleccionada no existe o no está disponible.
        </p>

        <button
          onClick={() => navigate("/applicant/evaluaciones")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
        >
          Volver a evaluaciones
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/applicant/evaluaciones")}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-bold mb-6"
      >
        <ArrowLeft size={18} />
        Volver a evaluaciones
      </button>

      <SectionHeader
        title={evaluation.title}
        description="Responde la evaluación técnica asignada. El puntaje final será revisado internamente por el líder técnico."
        action={<StatusBadge status={evaluation.status} />}
      />

      {message && (
        <div
          className={`mb-5 border rounded-3xl px-5 py-4 font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 space-y-5">
          {questions.map((question, index) => (
            <article
              key={question.id}
              className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm font-bold text-emerald-600">
                    Pregunta {index + 1}
                  </p>

                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {question.question}
                  </h3>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold">
                  {question.type}
                </span>
              </div>

              {["Opción múltiple", "Verdadero/Falso"].includes(
                question.type
              ) ? (
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-3 border rounded-2xl px-4 py-3 cursor-pointer transition-all ${
                        answers[question.id] === option
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                        className="accent-emerald-500"
                      />
                      <span className="font-semibold">{option}</span>
                    </label>
                  ))}
                </div>
              ) : question.type === "Código" ? (
                <textarea
                  value={answers[question.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  placeholder="Escribe tu solución o fragmento de código..."
                  className="w-full min-h-44 border border-slate-800 rounded-2xl px-4 py-3 outline-none bg-slate-950 text-emerald-100 font-mono text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              ) : (
                <textarea
                  value={answers[question.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  placeholder="Escribe tu respuesta..."
                  className="input-light min-h-32"
                />
              )}
            </article>
          ))}
        </section>

        <aside className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-6 shadow-sm h-fit">
          <h3 className="text-xl font-black text-slate-900 mb-5">
            Información de evaluación
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-600 rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <Clock className="text-emerald-600" size={22} />
              <span>{evaluation.duration} minutos</span>
            </div>

            <div className="flex items-center gap-3 text-slate-600 rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <ClipboardList className="text-emerald-600" size={22} />
              <span>{questions.length} preguntas</span>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-br from-emerald-50 to-sky-50 border border-emerald-100 rounded-3xl p-4">
            <p className="text-sm text-slate-600">
              El postulante no visualizará el puntaje obtenido. La revisión será
              gestionada por el líder técnico.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20"
          >
            <Send size={18} />
            Enviar evaluación
          </button>
        </aside>
      </div>
    </div>
  );
}

export default ApplicantEvaluationDetail;