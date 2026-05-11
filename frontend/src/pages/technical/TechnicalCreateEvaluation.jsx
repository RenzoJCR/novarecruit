import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { areas } from "../../data/areas.js";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { useData } from "../../context/DataContext.jsx";

const initialForm = {
  title: "",
  area: "Frontend",
  duration: 40,
  questions: 10,
};

function TechnicalCreateEvaluation() {
  const navigate = useNavigate();
  const { createEvaluation } = useData();

  const [form, setForm] = useState(initialForm);
  const [questionList, setQuestionList] = useState([
    {
      id: 1,
      question: "",
      type: "Opción múltiple",
    },
  ]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const updateQuestion = (questionId, field, value) => {
    setQuestionList((prevQuestions) =>
      prevQuestions.map((item) =>
        item.id === questionId
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const addQuestion = () => {
    setQuestionList((prevQuestions) => [
      ...prevQuestions,
      {
        id: Date.now(),
        question: "",
        type: "Opción múltiple",
      },
    ]);
  };

  const removeQuestion = (questionId) => {
    setQuestionList((prevQuestions) =>
      prevQuestions.filter((item) => item.id !== questionId)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title) {
      setMessage("Ingresa un título para la evaluación.");
      return;
    }

    const completedQuestions = questionList.filter(
      (item) => item.question.trim() !== ""
    );

    if (completedQuestions.length === 0) {
      setMessage("Agrega al menos una pregunta.");
      return;
    }

    createEvaluation({
      title: form.title,
      area: form.area,
      duration: Number(form.duration),
      questions: completedQuestions.length,
      questionList: completedQuestions,
    });

    setMessage("Evaluación creada correctamente.");

    setTimeout(() => {
      navigate("/technical/evaluaciones");
    }, 800);
  };

  return (
    <div>
      <SectionHeader
        title="Crear evaluación técnica"
        description="Registra una evaluación reutilizable para luego asignarla a candidatos."
      />

      {message && (
        <div className="mb-5 bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl px-5 py-4 font-medium">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6"
      >
        <section className="xl:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            Datos generales
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Título
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej: Evaluación React Junior"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Área
              </label>
              <select
                name="area"
                value={form.area}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              >
                {areas.map((area) => (
                  <option key={area.id} value={area.name}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Duración en minutos
              </label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
            >
              Guardar evaluación
            </button>
          </div>
        </section>

        <section className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Preguntas
              </h2>
              <p className="text-sm text-slate-500">
                Puedes simular preguntas de opción múltiple, texto o código.
              </p>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-semibold"
            >
              Agregar
            </button>
          </div>

          <div className="space-y-4">
            {questionList.map((item, index) => (
              <div
                key={item.id}
                className="border border-slate-200 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900">
                    Pregunta {index + 1}
                  </h3>

                  {questionList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(item.id)}
                      className="text-sm text-red-600 font-semibold"
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                <textarea
                  value={item.question}
                  onChange={(e) =>
                    updateQuestion(item.id, "question", e.target.value)
                  }
                  placeholder="Escribe la pregunta..."
                  className="w-full min-h-24 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                />

                <select
                  value={item.type}
                  onChange={(e) =>
                    updateQuestion(item.id, "type", e.target.value)
                  }
                  className="mt-3 w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="Opción múltiple">Opción múltiple</option>
                  <option value="Texto">Texto</option>
                  <option value="Código">Código</option>
                  <option value="Verdadero/Falso">Verdadero/Falso</option>
                </select>
              </div>
            ))}
          </div>
        </section>
      </form>
    </div>
  );
}

export default TechnicalCreateEvaluation;