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
          item.type === "Opción múltiple"
            ? ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"]
            : [],
      }));
    }

    return fallbackQuestions;
  }, [evaluation]);

  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    const answeredQuestions = Object.values(answers).filter(
      (answer) => answer && answer.trim() !== ""
    );

    if (answeredQuestions.length < questions.length) {
      setMessage("Responde todas las preguntas antes de enviar la evaluación.");
      return;
    }

    const result = submitApplicantEvaluation(evaluation.id);
    setMessage(result.message);

    if (result.ok) {
      setTimeout(() => {
        navigate("/applicant/evaluaciones");
      }, 900);
    }
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
        className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold mb-6"
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
        <div className="mb-5 bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl px-5 py-4 font-medium">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 space-y-5">
          {questions.map((question, index) => (
            <article
              key={question.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-blue-600">
                    Pregunta {index + 1}
                  </p>

                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {question.question}
                  </h3>
                </div>

                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                  {question.type}
                </span>
              </div>

              {question.type === "Opción múltiple" ? (
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-slate-50"
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                      />
                      <span className="text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answers[question.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  placeholder="Escribe tu respuesta..."
                  className="w-full min-h-32 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                />
              )}
            </article>
          ))}
        </section>

        <aside className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="text-xl font-bold text-slate-900 mb-5">
            Información de evaluación
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-600">
              <Clock className="text-blue-600" size={22} />
              <span>{evaluation.duration} minutos</span>
            </div>

            <div className="flex items-center gap-3 text-slate-600">
              <ClipboardList className="text-blue-600" size={22} />
              <span>{questions.length} preguntas</span>
            </div>
          </div>

          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <p className="text-sm text-slate-600">
              El postulante no visualizará el puntaje obtenido. La revisión será
              gestionada por el líder técnico.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
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