import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  Layers3,
  Plus,
  Trash2,
  Save,
  HelpCircle,
  Sparkles,
  ListChecks,
} from "lucide-react";

import { areas } from "../../data/areas.js";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { useData } from "../../context/DataContext.jsx";

const initialForm = {
  title: "",
  area: "Frontend",
  duration: 40,
};

const inputWithIconClass =
  "w-full border border-slate-300 rounded-xl py-3 pr-4 pl-12 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

const createEmptyQuestion = () => ({
  id: Date.now(),
  question: "",
  type: "Opción múltiple",
  options: ["", "", "", ""],
  correctAnswer: "",
});

function TechnicalCreateEvaluation() {
  const navigate = useNavigate();
  const { createEvaluation } = useData();

  const [form, setForm] = useState(initialForm);
  const [questionList, setQuestionList] = useState([
    {
      id: 1,
      question: "",
      type: "Opción múltiple",
      options: ["", "", "", ""],
      correctAnswer: "",
    },
  ]);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const updateQuestion = (questionId, field, value) => {
    setQuestionList((prevQuestions) =>
      prevQuestions.map((item) => {
        if (item.id !== questionId) return item;

        if (field === "type") {
          if (value === "Opción múltiple") {
            return {
              ...item,
              type: value,
              options: item.options?.length ? item.options : ["", "", "", ""],
              correctAnswer: "",
            };
          }

          if (value === "Verdadero/Falso") {
            return {
              ...item,
              type: value,
              options: ["Verdadero", "Falso"],
              correctAnswer: "",
            };
          }

          return {
            ...item,
            type: value,
            options: [],
            correctAnswer: "",
          };
        }

        return {
          ...item,
          [field]: value,
        };
      })
    );
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestionList((prevQuestions) =>
      prevQuestions.map((item) => {
        if (item.id !== questionId) return item;

        const updatedOptions = [...item.options];
        updatedOptions[optionIndex] = value;

        return {
          ...item,
          options: updatedOptions,
          correctAnswer:
            item.correctAnswer === item.options[optionIndex]
              ? value
              : item.correctAnswer,
        };
      })
    );
  };

  const addOption = (questionId) => {
    setQuestionList((prevQuestions) =>
      prevQuestions.map((item) =>
        item.id === questionId
          ? {
              ...item,
              options: [...item.options, ""],
            }
          : item
      )
    );
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestionList((prevQuestions) =>
      prevQuestions.map((item) => {
        if (item.id !== questionId) return item;

        const optionToRemove = item.options[optionIndex];
        const updatedOptions = item.options.filter(
          (_, index) => index !== optionIndex
        );

        return {
          ...item,
          options: updatedOptions,
          correctAnswer:
            item.correctAnswer === optionToRemove ? "" : item.correctAnswer,
        };
      })
    );
  };

  const addQuestion = () => {
    setQuestionList((prevQuestions) => [
      ...prevQuestions,
      createEmptyQuestion(),
    ]);
  };

  const removeQuestion = (questionId) => {
    setQuestionList((prevQuestions) =>
      prevQuestions.filter((item) => item.id !== questionId)
    );
  };

  const validateQuestions = () => {
    const completedQuestions = questionList.filter(
      (item) => item.question.trim() !== ""
    );

    if (completedQuestions.length === 0) {
      return "Agrega al menos una pregunta.";
    }

    for (const question of completedQuestions) {
      if (question.type === "Opción múltiple") {
        const validOptions = question.options.filter(
          (option) => option.trim() !== ""
        );

        if (validOptions.length < 2) {
          return "Cada pregunta de opción múltiple debe tener al menos 2 alternativas.";
        }
      }

      if (
        ["Opción múltiple", "Verdadero/Falso"].includes(question.type) &&
        !question.correctAnswer
      ) {
        return "Selecciona la respuesta correcta en las preguntas cerradas.";
      }
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title) {
      setMessage("Ingresa un título para la evaluación.");
      setMessageType("error");
      return;
    }

    if (!form.duration || Number(form.duration) <= 0) {
      setMessage("Ingresa una duración válida.");
      setMessageType("error");
      return;
    }

    const questionError = validateQuestions();

    if (questionError) {
      setMessage(questionError);
      setMessageType("error");
      return;
    }

    const completedQuestions = questionList
      .filter((item) => item.question.trim() !== "")
      .map((item) => ({
        ...item,
        options: item.options?.filter((option) => option.trim() !== "") || [],
      }));

    createEvaluation({
      title: form.title,
      area: form.area,
      duration: Number(form.duration),
      questions: completedQuestions.length,
      questionList: completedQuestions,
    });

    setMessage("Evaluación creada correctamente. Redirigiendo al banco técnico...");
    setMessageType("success");

    setTimeout(() => {
      navigate("/technical/evaluaciones");
    }, 900);
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div>
      <SectionHeader
        title="Crear evaluación técnica"
        description="Diseña una evaluación reutilizable para asignarla a candidatos aprobados por RRHH."
      />

      {message && (
        <div
          className={`mb-5 border rounded-3xl px-5 py-4 font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6"
      >
        <aside className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-7 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center">
              <ClipboardList size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Datos generales
              </h2>
              <p className="text-sm text-slate-500">
                Configuración base de la prueba.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Título de evaluación *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej: Evaluación React Junior"
                className="input-light"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Área
              </label>
              <div className="relative">
                <Layers3
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                />
                <select
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  className={inputWithIconClass}
                >
                  {areas.map((area) => (
                    <option key={area.id} value={area.name}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Duración en minutos *
              </label>
              <div className="relative">
                <Clock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                />
                <input
                  type="number"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  min="1"
                  className={inputWithIconClass}
                />
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-sky-50 border border-emerald-100 p-5">
              <div className="flex items-start gap-3">
                <Sparkles
                  size={22}
                  className="text-emerald-600 shrink-0 mt-1"
                />
                <div>
                  <h3 className="font-black text-slate-900">
                    Evaluación reusable
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Esta prueba quedará en el banco técnico y podrá asignarse a
                    diferentes postulantes.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20"
            >
              <Save size={18} />
              Guardar evaluación
            </button>
          </div>
        </aside>

        <section className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-7 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center">
                <HelpCircle size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Preguntas
                </h2>
                <p className="text-sm text-slate-500">
                  {questionList.length} pregunta(s) agregada(s)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-2xl font-black transition-colors"
            >
              <Plus size={18} />
              Agregar pregunta
            </button>
          </div>

          <div className="space-y-5">
            {questionList.map((item, index) => (
              <article
                key={item.id}
                className="border border-slate-200 rounded-3xl p-5 bg-slate-50/60"
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm font-bold text-emerald-600">
                      Pregunta {index + 1}
                    </p>
                    <h3 className="font-black text-slate-900">
                      Configuración de pregunta
                    </h3>
                  </div>

                  {questionList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(item.id)}
                      className="inline-flex items-center gap-2 text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl font-bold"
                    >
                      <Trash2 size={17} />
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_240px] gap-4">
                  <textarea
                    value={item.question}
                    onChange={(e) =>
                      updateQuestion(item.id, "question", e.target.value)
                    }
                    placeholder="Escribe la pregunta que verá el postulante..."
                    className="input-light min-h-28"
                  />

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Tipo de pregunta
                    </label>
                    <select
                      value={item.type}
                      onChange={(e) =>
                        updateQuestion(item.id, "type", e.target.value)
                      }
                      className="input-light"
                    >
                      <option value="Opción múltiple">Opción múltiple</option>
                      <option value="Texto">Texto</option>
                      <option value="Código">Código</option>
                      <option value="Verdadero/Falso">Verdadero/Falso</option>
                    </select>
                  </div>
                </div>

                {item.type === "Opción múltiple" && (
                  <div className="mt-5 bg-white border border-slate-200 rounded-3xl p-5">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <ListChecks size={20} className="text-emerald-600" />
                        <h4 className="font-black text-slate-900">
                          Alternativas
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => addOption(item.id)}
                        className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        + Agregar alternativa
                      </button>
                    </div>

                    <div className="space-y-3">
                      {item.options.map((option, optionIndex) => (
                        <div
                          key={`${item.id}-${optionIndex}`}
                          className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-center"
                        >
                          <input
                            value={option}
                            onChange={(e) =>
                              updateOption(
                                item.id,
                                optionIndex,
                                e.target.value
                              )
                            }
                            placeholder={`Alternativa ${optionIndex + 1}`}
                            className="input-light"
                          />

                          <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
                            <input
                              type="radio"
                              name={`correct-${item.id}`}
                              checked={
                                item.correctAnswer !== "" &&
                                item.correctAnswer === option
                              }
                              disabled={option.trim() === ""}
                              onChange={() =>
                                updateQuestion(
                                  item.id,
                                  "correctAnswer",
                                  option
                                )
                              }
                              className="accent-emerald-500"
                            />
                            Correcta
                          </label>

                          {item.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(item.id, optionIndex)}
                              className="text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl font-bold"
                            >
                              Quitar
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.type === "Verdadero/Falso" && (
                  <div className="mt-5 bg-white border border-slate-200 rounded-3xl p-5">
                    <h4 className="font-black text-slate-900 mb-4">
                      Respuesta correcta
                    </h4>

                    <div className="flex flex-wrap gap-3">
                      {["Verdadero", "Falso"].map((option) => (
                        <label
                          key={option}
                          className={`flex items-center gap-2 px-4 py-3 rounded-2xl border cursor-pointer ${
                            item.correctAnswer === option
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-white border-slate-200 text-slate-600"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`correct-${item.id}`}
                            checked={item.correctAnswer === option}
                            onChange={() =>
                              updateQuestion(item.id, "correctAnswer", option)
                            }
                            className="accent-emerald-500"
                          />
                          <span className="font-bold">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {item.type === "Texto" && (
                  <div className="mt-5 rounded-2xl bg-white border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">
                      Esta pregunta será respondida con texto libre por el
                      postulante y será revisada manualmente por el líder técnico.
                    </p>
                  </div>
                )}

                {item.type === "Código" && (
                  <div className="mt-5 rounded-2xl bg-slate-950 border border-slate-800 p-4">
                    <p className="text-sm text-slate-300">
                      Esta pregunta permitirá una respuesta tipo código. En una
                      versión real, se podría integrar un editor como Monaco o
                      CodeMirror.
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </form>
    </div>
  );
}

export default TechnicalCreateEvaluation;