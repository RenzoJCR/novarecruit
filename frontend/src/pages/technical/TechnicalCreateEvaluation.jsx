import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpenCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  FileQuestion,
  Plus,
  Save,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { evaluacionService } from "../../services/evaluacionService.js";
import { userService } from "../../services/userService.js";
import { vacanteService } from "../../services/vacanteService.js";

const initialForm = {
  vacanteId: "",
  tecnicoId: "",
  titulo: "",
  descripcion: "",
  duracionMinutos: 40,
  puntajeMaximo: 100,
};

const initialQuestion = {
  tipoPregunta: "MULTIPLE",
  enunciado: "",
  puntaje: 20,
  orden: 1,
  opciones: [
    { texto: "", esCorrecta: true },
    { texto: "", esCorrecta: false },
  ],
};

const closedQuestionTypes = ["MULTIPLE", "VERDADERO_FALSO"];

function TechnicalCreateEvaluation() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [questions, setQuestions] = useState([initialQuestion]);

  const [vacantes, setVacantes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);

  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const totalPoints = useMemo(() => {
    return questions.reduce((total, question) => {
      return total + Number(question.puntaje || 0);
    }, 0);
  }, [questions]);

  useEffect(() => {
    loadCatalogs();
  }, []);

  const loadCatalogs = async () => {
  try {
    setLoadingCatalogs(true);

    const [vacantesData, usersData] = await Promise.all([
      vacanteService.getAll(),
      userService.getAll(),
    ]);

    const availableVacantes = vacantesData.filter(
      (vacante) =>
        vacante.estado !== "CERRADA" && vacante.estado !== "CANCELADA"
    );

    const technicalUsers = usersData.filter(
      (user) => user.estado && user.rolNombre === "LIDER_TECNICO"
    );

    setVacantes(availableVacantes);
    setTecnicos(technicalUsers);

    setForm((prevForm) => ({
      ...prevForm,
      vacanteId: availableVacantes[0]?.id || "",
      tecnicoId: technicalUsers[0]?.id || "",
    }));

    if (availableVacantes.length === 0) {
      showMessage(
        "No hay vacantes disponibles para crear evaluaciones.",
        "error"
      );
    }

    if (technicalUsers.length === 0) {
      showMessage(
        "No hay usuarios activos con rol de líder técnico.",
        "error"
      );
    }
  } catch (error) {
    console.error("Error cargando catálogos:", error);
    showMessage(
      error.userMessage || "No se pudieron cargar los catálogos.",
      "error"
    );
  } finally {
    setLoadingCatalogs(false);
  }
};

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4500);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
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

        return {
          ...question,
          [field]: field === "puntaje" || field === "orden" ? Number(value) : value,
        };
      })
    );
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, currentQuestionIndex) => {
        if (currentQuestionIndex !== questionIndex) return question;

        const updatedOptions = question.opciones.map((option, currentOptionIndex) => {
          if (currentOptionIndex !== optionIndex) {
            return field === "esCorrecta"
              ? { ...option, esCorrecta: false }
              : option;
          }

          return {
            ...option,
            [field]: field === "esCorrecta" ? true : value,
          };
        });

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
        orden: prevQuestions.length + 1,
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      showMessage("La evaluación debe tener al menos una pregunta.", "error");
      return;
    }

    setQuestions((prevQuestions) =>
      prevQuestions
        .filter((_, questionIndex) => questionIndex !== index)
        .map((question, questionIndex) => ({
          ...question,
          orden: questionIndex + 1,
        }))
    );
  };

  const addOption = (questionIndex) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question, currentQuestionIndex) => {
        if (currentQuestionIndex !== questionIndex) return question;

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
          showMessage("Una pregunta cerrada debe tener al menos dos opciones.", "error");
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
    if (!form.vacanteId) return "Selecciona una vacante.";
    if (!form.tecnicoId) return "Selecciona un líder técnico.";

    if (!form.titulo.trim()) return "Ingresa el título de la evaluación.";
    if (form.titulo.trim().length < 5)
      return "El título debe tener al menos 5 caracteres.";

    if (!form.duracionMinutos || Number(form.duracionMinutos) <= 0)
      return "La duración debe ser mayor a cero.";

    if (!form.puntajeMaximo || Number(form.puntajeMaximo) <= 0)
      return "El puntaje máximo debe ser mayor a cero.";

    if (questions.length === 0)
      return "La evaluación debe tener al menos una pregunta.";

    if (totalPoints > Number(form.puntajeMaximo)) {
      return "La suma de puntajes no puede superar el puntaje máximo.";
    }

    for (const question of questions) {
      if (!question.enunciado.trim()) {
        return "Todas las preguntas deben tener enunciado.";
      }

      if (!question.puntaje || Number(question.puntaje) <= 0) {
        return "Todas las preguntas deben tener puntaje mayor a cero.";
      }

      if (closedQuestionTypes.includes(question.tipoPregunta)) {
        if (!question.opciones || question.opciones.length < 2) {
          return "Las preguntas cerradas deben tener al menos dos opciones.";
        }

        const emptyOption = question.opciones.some(
          (option) => !option.texto.trim()
        );

        if (emptyOption) {
          return "Todas las opciones deben tener texto.";
        }

        const correctOptions = question.opciones.filter(
          (option) => option.esCorrecta
        );

        if (correctOptions.length !== 1) {
          return "Cada pregunta cerrada debe tener exactamente una respuesta correcta.";
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
      tecnicoId: Number(form.tecnicoId),
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

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div>
      <SectionHeader
        title="Crear evaluación técnica"
        description="Crea una evaluación ligada a una vacante y define sus preguntas."
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
        className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6"
      >
        <section className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center">
                <BookOpenCheck size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Datos principales
                </h2>
                <p className="text-sm text-slate-500">
                  La evaluación quedará asociada a una vacante específica.
                </p>
              </div>
            </div>

            {loadingCatalogs ? (
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 text-center">
                <h3 className="text-xl font-black text-slate-900">
                  Cargando catálogos...
                </h3>
                <p className="text-slate-500 mt-2">
                  Consultando vacantes y líderes técnicos desde MySQL.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Vacante *
                  </label>
                  <div className="relative">
                    <Briefcase
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                    />
                    <select
                      name="vacanteId"
                      value={form.vacanteId}
                      onChange={handleFormChange}
                      className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-12 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    >
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
                    Líder técnico *
                  </label>
                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                    />
                    <select
                      name="tecnicoId"
                      value={form.tecnicoId}
                      onChange={handleFormChange}
                      className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-12 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    >
                      {tecnicos.map((tecnico) => (
                        <option key={tecnico.id} value={tecnico.id}>
                          {tecnico.nombreCompleto}
                        </option>
                      ))}
                    </select>
                  </div>
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
                    className="input-light"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleFormChange}
                    placeholder="Describe el objetivo de la evaluación..."
                    className="w-full min-h-28 border border-slate-300 rounded-xl p-4 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Duración *
                  </label>
                  <div className="relative">
                    <Clock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                    />
                    <input
                      type="number"
                      name="duracionMinutos"
                      value={form.duracionMinutos}
                      onChange={handleFormChange}
                      className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-12 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Puntaje máximo *
                  </label>
                  <input
                    type="number"
                    name="puntajeMaximo"
                    value={form.puntajeMaximo}
                    onChange={handleFormChange}
                    className="input-light"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Preguntas
                </h2>
                <p className="text-sm text-slate-500">
                  Puedes combinar preguntas de opción múltiple, texto y código.
                </p>
              </div>

              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-2xl font-black"
              >
                <Plus size={17} />
                Agregar pregunta
              </button>
            </div>

            <div className="space-y-5">
              {questions.map((question, questionIndex) => (
                <div
                  key={questionIndex}
                  className="rounded-[1.5rem] bg-slate-50 border border-slate-200 p-5"
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        Pregunta {questionIndex + 1}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Orden #{questionIndex + 1}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 px-3 py-2 rounded-xl font-black"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[200px_140px_1fr] gap-4">
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
                        type="number"
                        value={question.puntaje}
                        onChange={(e) =>
                          handleQuestionChange(
                            questionIndex,
                            "puntaje",
                            e.target.value
                          )
                        }
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
                        className="input-light"
                      />
                    </div>
                  </div>

                  {closedQuestionTypes.includes(question.tipoPregunta) && (
                    <div className="mt-5">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <h4 className="font-black text-slate-900">Opciones</h4>

                        {question.tipoPregunta === "MULTIPLE" && (
                          <button
                            type="button"
                            onClick={() => addOption(questionIndex)}
                            className="inline-flex items-center gap-2 text-emerald-700 font-black text-sm"
                          >
                            <Plus size={16} />
                            Agregar opción
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        {question.opciones.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="grid grid-cols-1 md:grid-cols-[1fr_120px_auto] gap-3 items-center"
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
                              disabled={question.tipoPregunta === "VERDADERO_FALSO"}
                              placeholder={`Opción ${optionIndex + 1}`}
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
                                className="accent-emerald-500"
                              />
                              Correcta
                            </label>

                            {question.tipoPregunta === "MULTIPLE" && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeOption(questionIndex, optionIndex)
                                }
                                className="inline-flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 px-3 py-2 rounded-xl"
                              >
                                <Trash2 size={16} />
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
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm h-fit">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center mb-5">
              <FileQuestion size={26} />
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              Resumen
            </h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-black text-slate-500">Preguntas</p>
                <p className="text-3xl font-black text-slate-900">
                  {questions.length}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-black text-slate-500">
                  Puntaje usado
                </p>
                <p
                  className={`text-3xl font-black ${
                    totalPoints > Number(form.puntajeMaximo)
                      ? "text-rose-600"
                      : "text-emerald-600"
                  }`}
                >
                  {totalPoints}/{form.puntajeMaximo || 0}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-sky-50 border border-emerald-100 p-5">
              <div className="flex items-start gap-3">
                <Sparkles size={22} className="text-emerald-600 shrink-0 mt-1" />
                <p className="text-sm text-slate-600">
                  La evaluación se guardará en MySQL y luego podrá asignarse a
                  postulaciones aprobadas por RRHH.
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <button
                type="submit"
                disabled={saving || loadingCatalogs}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 disabled:from-slate-300 disabled:to-slate-300 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20 disabled:shadow-none"
              >
                <Save size={18} />
                {saving ? "Guardando..." : "Crear evaluación"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/technical/evaluaciones")}
                className="w-full inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-black"
              >
                <X size={18} />
                Cancelar
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-600" />
              Validaciones aplicadas
            </h3>

            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>• La evaluación debe tener al menos una pregunta.</li>
              <li>• La suma de puntos no debe superar el puntaje máximo.</li>
              <li>• Cada pregunta cerrada debe tener una respuesta correcta.</li>
              <li>• Texto y código no deben tener opciones.</li>
            </ul>
          </div>
        </aside>
      </form>
    </div>
  );
}

export default TechnicalCreateEvaluation;