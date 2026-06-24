import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Clock,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { evaluacionService } from "../../services/evaluacionService.js";
import { vacanteService } from "../../services/vacanteService.js";

const initialForm = {
  vacanteId: "",
  titulo: "",
  descripcion: "",
  duracionMinutos: "40",
  puntajeMaximo: "100",
};

const initialQuestion = {
  tipoPregunta: "MULTIPLE",
  enunciado: "",
  puntaje: "20",
  opciones: [
    { texto: "", esCorrecta: true },
    { texto: "", esCorrecta: false },
  ],
};

const closedQuestionTypes = ["MULTIPLE", "VERDADERO_FALSO"];
const questionTypes = ["MULTIPLE", "VERDADERO_FALSO", "TEXTO", "CODIGO"];

function isOnlyNumbers(value) {
  return /^[0-9\s]+$/.test(value.trim());
}

function hasTextContent(value) {
  const text = value.trim();

  if (!text) return false;
  if (isOnlyNumbers(text)) return false;

  return /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(text);
}

function allowInteger(value) {
  return value === "" || /^\d+$/.test(value);
}

function allowDecimal(value) {
  return value === "" || /^\d*\.?\d{0,2}$/.test(value);
}

function toNumber(value) {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
}

function normalizeOptionText(value) {
  return value.trim().toLowerCase();
}

function TechnicalCreateEvaluation() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [questions, setQuestions] = useState([
    {
      ...initialQuestion,
      opciones: initialQuestion.opciones.map((option) => ({ ...option })),
    },
  ]);
  const [vacantes, setVacantes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const totalPoints = useMemo(() => {
    return questions.reduce((total, question) => {
      return total + toNumber(question.puntaje);
    }, 0);
  }, [questions]);

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4500);
  };

  const loadVacantes = async () => {
    try {
      setLoading(true);

      const data = await vacanteService.getAll();

      const availableVacantes = data.filter(
        (vacante) =>
          vacante.estado !== "CERRADA" && vacante.estado !== "CANCELADA"
      );

      setVacantes(availableVacantes);

      setForm((prev) => ({
        ...prev,
        vacanteId: availableVacantes[0]?.id || "",
      }));
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudieron cargar las vacantes.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVacantes();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "duracionMinutos") {
      if (allowInteger(value)) {
        setForm((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      return;
    }

    if (name === "puntajeMaximo") {
      if (allowDecimal(value)) {
        setForm((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buildOptionsByType = (type) => {
    if (type === "VERDADERO_FALSO") {
      return [
        { texto: "Verdadero", esCorrecta: true },
        { texto: "Falso", esCorrecta: false },
      ];
    }

    if (type === "MULTIPLE") {
      return [
        { texto: "", esCorrecta: true },
        { texto: "", esCorrecta: false },
      ];
    }

    return [];
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, questionIndex) => {
        if (questionIndex !== index) return question;

        if (field === "tipoPregunta") {
          return {
            ...question,
            tipoPregunta: value,
            opciones: buildOptionsByType(value),
          };
        }

        if (field === "puntaje") {
          if (!allowDecimal(value)) return question;

          return {
            ...question,
            puntaje: value,
          };
        }

        return {
          ...question,
          [field]: value,
        };
      })
    );
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, currentQuestionIndex) => {
        if (currentQuestionIndex !== questionIndex) return question;

        const updatedOptions = question.opciones.map(
          (option, currentOptionIndex) => {
            if (field === "esCorrecta") {
              return {
                ...option,
                esCorrecta: currentOptionIndex === optionIndex,
              };
            }

            if (currentOptionIndex !== optionIndex) return option;

            return {
              ...option,
              texto: value,
            };
          }
        );

        return {
          ...question,
          opciones: updatedOptions,
        };
      })
    );
  };

  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        ...initialQuestion,
        opciones: initialQuestion.opciones.map((option) => ({ ...option })),
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      showMessage("La evaluación debe tener al menos una pregunta.", "error");
      return;
    }

    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, questionIndex) => questionIndex !== index)
    );
  };

  const addOption = (questionIndex) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, currentQuestionIndex) => {
        if (currentQuestionIndex !== questionIndex) return question;

        if (question.tipoPregunta !== "MULTIPLE") {
          return question;
        }

        return {
          ...question,
          opciones: [...question.opciones, { texto: "", esCorrecta: false }],
        };
      })
    );
  };

  const removeOption = (questionIndex, optionIndex) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, currentQuestionIndex) => {
        if (currentQuestionIndex !== questionIndex) return question;

        if (question.opciones.length <= 2) {
          showMessage(
            "Una pregunta cerrada debe tener al menos dos opciones.",
            "error"
          );
          return question;
        }

        const updatedOptions = question.opciones.filter(
          (_, currentOptionIndex) => currentOptionIndex !== optionIndex
        );

        if (!updatedOptions.some((option) => option.esCorrecta)) {
          updatedOptions[0].esCorrecta = true;
        }

        return {
          ...question,
          opciones: updatedOptions,
        };
      })
    );
  };

  const validateForm = () => {
    const titulo = form.titulo.trim();
    const descripcion = form.descripcion.trim();
    const duracion = toNumber(form.duracionMinutos);
    const puntajeMaximo = toNumber(form.puntajeMaximo);

    if (!currentUser?.id) {
      return "No se encontró el usuario técnico autenticado.";
    }

    if (!form.vacanteId) {
      return "Selecciona una vacante.";
    }

    const selectedVacanteExists = vacantes.some(
      (vacante) => Number(vacante.id) === Number(form.vacanteId)
    );

    if (!selectedVacanteExists) {
      return "Selecciona una vacante válida.";
    }

    if (!titulo) {
      return "Ingresa el título de la evaluación.";
    }

    if (titulo.length < 5) {
      return "El título debe tener al menos 5 caracteres.";
    }

    if (!hasTextContent(titulo)) {
      return "El título debe contener texto válido y no puede ser solo números.";
    }

    if (descripcion) {
      if (descripcion.length < 10) {
        return "La descripción debe tener al menos 10 caracteres si la ingresas.";
      }

      if (!hasTextContent(descripcion)) {
        return "La descripción debe contener texto válido y no puede ser solo números.";
      }
    }

    if (!form.duracionMinutos) {
      return "Ingresa la duración de la evaluación.";
    }

    if (!Number.isInteger(duracion)) {
      return "La duración debe ser un número entero.";
    }

    if (duracion <= 0) {
      return "La duración debe ser mayor a 0.";
    }

    if (duracion > 300) {
      return "La duración no debería superar los 300 minutos.";
    }

    if (!form.puntajeMaximo) {
      return "Ingresa el puntaje máximo.";
    }

    if (puntajeMaximo <= 0) {
      return "El puntaje máximo debe ser mayor a 0.";
    }

    if (questions.length === 0) {
      return "La evaluación debe tener al menos una pregunta.";
    }

    if (totalPoints <= 0) {
      return "La suma de puntos debe ser mayor a 0.";
    }

    if (totalPoints > puntajeMaximo) {
      return "La suma de puntos no puede superar el puntaje máximo.";
    }

    for (let index = 0; index < questions.length; index++) {
      const question = questions[index];
      const questionNumber = index + 1;
      const enunciado = question.enunciado.trim();
      const puntaje = toNumber(question.puntaje);

      if (!questionTypes.includes(question.tipoPregunta)) {
        return `La pregunta ${questionNumber} tiene un tipo no válido.`;
      }

      if (!enunciado) {
        return `La pregunta ${questionNumber} debe tener enunciado.`;
      }

      if (enunciado.length < 5) {
        return `El enunciado de la pregunta ${questionNumber} debe tener al menos 5 caracteres.`;
      }

      if (!hasTextContent(enunciado)) {
        return `El enunciado de la pregunta ${questionNumber} debe contener texto válido y no puede ser solo números.`;
      }

      if (!question.puntaje) {
        return `La pregunta ${questionNumber} debe tener puntaje.`;
      }

      if (puntaje <= 0) {
        return `La pregunta ${questionNumber} debe tener puntaje mayor a 0.`;
      }

      if (puntaje > puntajeMaximo) {
        return `La pregunta ${questionNumber} no puede tener más puntaje que el puntaje máximo.`;
      }

      if (closedQuestionTypes.includes(question.tipoPregunta)) {
        if (!question.opciones || question.opciones.length < 2) {
          return `La pregunta ${questionNumber} debe tener al menos dos opciones.`;
        }

        const emptyOption = question.opciones.some(
          (option) => !option.texto.trim()
        );

        if (emptyOption) {
          return `Todas las opciones de la pregunta ${questionNumber} deben tener texto.`;
        }

        const optionTexts = question.opciones.map((option) =>
          normalizeOptionText(option.texto)
        );

        const uniqueOptionTexts = new Set(optionTexts);

        if (uniqueOptionTexts.size !== optionTexts.length) {
          return `La pregunta ${questionNumber} tiene opciones repetidas.`;
        }

        const correctOptions = question.opciones.filter(
          (option) => option.esCorrecta
        );

        if (correctOptions.length !== 1) {
          return `La pregunta ${questionNumber} debe tener una sola respuesta correcta.`;
        }
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      showMessage(validationError, "error");
      return;
    }

    const payload = {
      vacanteId: Number(form.vacanteId),
      tecnicoId: Number(currentUser.id),
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim() || null,
      duracionMinutos: Number(form.duracionMinutos),
      puntajeMaximo: Number(form.puntajeMaximo),
      preguntas: questions.map((question, index) => ({
        tipoPregunta: question.tipoPregunta,
        enunciado: question.enunciado.trim(),
        puntaje: Number(question.puntaje),
        orden: index + 1,
        opciones: closedQuestionTypes.includes(question.tipoPregunta)
          ? question.opciones.map((option) => ({
              texto: option.texto.trim(),
              esCorrecta: Boolean(option.esCorrecta),
            }))
          : [],
      })),
    };

    try {
      setSaving(true);

      await evaluacionService.create(payload);

      showMessage("Evaluación creada correctamente.", "success");

      setTimeout(() => {
        navigate("/technical/evaluaciones");
      }, 900);
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo crear la evaluación.",
        "error"
      );
    } finally {
      setSaving(false);
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

  return (
    <div>
      <SectionHeader
        title="Crear evaluación"
        description="Registra una evaluación técnica para una vacante específica."
      />

      {message && (
        <div
          className={`mb-5 border rounded-2xl px-4 py-3 text-sm font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <Link
        to="/technical/evaluaciones"
        className="inline-flex items-center gap-2 text-emerald-700 font-black mb-5"
      >
        <ArrowLeft size={18} />
        Volver a evaluaciones
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-black text-slate-900">
            Datos principales
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            La evaluación quedará asociada a la vacante seleccionada.
          </p>

          {loading ? (
            <div className="mt-5 border border-slate-200 rounded-xl p-5 text-center text-slate-500">
              Cargando vacantes...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Vacante *
                </label>

                <div className="relative">
                  <Briefcase
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                  />

                  <select
                    name="vacanteId"
                    value={form.vacanteId}
                    onChange={handleFormChange}
                    className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-11 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    {vacantes.length === 0 && (
                      <option value="">No hay vacantes disponibles</option>
                    )}

                    {vacantes.map((vacante) => (
                      <option key={vacante.id} value={vacante.id}>
                        {vacante.titulo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Técnico responsable
                </label>

                <input
                  value={currentUser?.nombreCompleto || "Usuario técnico"}
                  disabled
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 text-slate-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Título *
                </label>

                <input
                  name="titulo"
                  value={form.titulo}
                  onChange={handleFormChange}
                  placeholder="Ej: Evaluación Backend Spring Boot"
                  maxLength={150}
                  className="input-light"
                />

                <p className="text-xs text-slate-400 mt-1">
                  Mínimo 5 caracteres. No debe ser solo números.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Descripción
                </label>

                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleFormChange}
                  placeholder="Describe brevemente el objetivo de la evaluación."
                  maxLength={1000}
                  className="w-full min-h-24 border border-slate-300 rounded-xl p-3 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />

                <p className="text-xs text-slate-400 mt-1">
                  Opcional. Si la ingresas, debe tener al menos 10 caracteres.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Duración en minutos *
                </label>

                <div className="relative">
                  <Clock
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                  />

                  <input
                    type="text"
                    inputMode="numeric"
                    name="duracionMinutos"
                    value={form.duracionMinutos}
                    onChange={handleFormChange}
                    placeholder="Ej: 40"
                    className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-11 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  Debe ser mayor a 0.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Puntaje máximo *
                </label>

                <input
                  type="text"
                  inputMode="decimal"
                  name="puntajeMaximo"
                  value={form.puntajeMaximo}
                  onChange={handleFormChange}
                  placeholder="Ej: 100"
                  className="input-light"
                />

                <p className="text-xs text-slate-400 mt-1">
                  Debe ser mayor a 0.
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">Preguntas</h2>

              <p className="text-sm text-slate-500 mt-1">
                Puntaje usado:{" "}
                <strong
                  className={
                    totalPoints > Number(form.puntajeMaximo)
                      ? "text-rose-600"
                      : "text-emerald-600"
                  }
                >
                  {totalPoints}/{form.puntajeMaximo || 0}
                </strong>
              </p>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center justify-center gap-2 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-black"
            >
              <Plus size={17} />
              Agregar pregunta
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((question, questionIndex) => (
              <div
                key={questionIndex}
                className="border border-slate-200 rounded-xl p-4"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-black text-slate-900">
                      Pregunta {questionIndex + 1}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {questionTypeLabel(question.tipoPregunta)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="inline-flex items-center justify-center gap-1.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-2 rounded-xl text-sm font-bold"
                  >
                    <Trash2 size={15} />
                    Quitar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[200px_140px_1fr] gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-500 mb-2">
                      Tipo
                    </label>

                    <select
                      value={question.tipoPregunta}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          "tipoPregunta",
                          e.target.value
                        )
                      }
                      className="input-light"
                    >
                      <option value="MULTIPLE">Opción múltiple</option>
                      <option value="VERDADERO_FALSO">Verdadero/Falso</option>
                      <option value="TEXTO">Texto</option>
                      <option value="CODIGO">Código</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-500 mb-2">
                      Puntaje
                    </label>

                    <input
                      type="text"
                      inputMode="decimal"
                      value={question.puntaje}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          "puntaje",
                          e.target.value
                        )
                      }
                      placeholder="Ej: 20"
                      className="input-light"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-500 mb-2">
                      Enunciado
                    </label>

                    <input
                      value={question.enunciado}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          "enunciado",
                          e.target.value
                        )
                      }
                      placeholder="Escribe la pregunta..."
                      maxLength={500}
                      className="input-light"
                    />
                  </div>
                </div>

                {closedQuestionTypes.includes(question.tipoPregunta) && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <p className="text-sm font-black text-slate-700">
                        Opciones
                      </p>

                      {question.tipoPregunta === "MULTIPLE" && (
                        <button
                          type="button"
                          onClick={() => addOption(questionIndex)}
                          className="text-sm font-black text-emerald-700 hover:text-emerald-800"
                        >
                          + Agregar opción
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {question.opciones.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="grid grid-cols-1 md:grid-cols-[1fr_120px_auto] gap-2 items-center"
                        >
                          <input
                            value={option.texto}
                            onChange={(e) =>
                              handleOptionChange(
                                questionIndex,
                                optionIndex,
                                "texto",
                                e.target.value
                              )
                            }
                            disabled={
                              question.tipoPregunta === "VERDADERO_FALSO"
                            }
                            placeholder={`Opción ${optionIndex + 1}`}
                            maxLength={250}
                            className="input-light"
                          />

                          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <input
                              type="radio"
                              checked={option.esCorrecta}
                              onChange={() =>
                                handleOptionChange(
                                  questionIndex,
                                  optionIndex,
                                  "esCorrecta",
                                  true
                                )
                              }
                              className="accent-emerald-600"
                            />
                            Correcta
                          </label>

                          {question.tipoPregunta === "MULTIPLE" && (
                            <button
                              type="button"
                              onClick={() =>
                                removeOption(questionIndex, optionIndex)
                              }
                              className="inline-flex items-center justify-center border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-2 rounded-xl text-sm font-bold"
                            >
                              <X size={15} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col md:flex-row justify-end gap-3">
          <Link
            to="/technical/evaluaciones"
            className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl text-sm font-black"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={saving || loading}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-5 py-3 rounded-xl text-sm font-black"
          >
            <Save size={17} />
            {saving ? "Guardando..." : "Crear evaluación"}
          </button>
        </section>
      </form>
    </div>
  );
}

export default TechnicalCreateEvaluation;