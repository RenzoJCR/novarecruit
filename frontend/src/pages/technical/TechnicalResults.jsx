import { useEffect, useMemo, useState } from "react";
import {
  Award,
  CheckCircle2,
  Eye,
  RefreshCw,
  Search,
  Star,
  Trophy,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { evaluacionPostulacionService } from "../../services/evaluacionPostulacionService.js";
import { vacanteService } from "../../services/vacanteService.js";

function TechnicalResults() {
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [reviewForms, setReviewForms] = useState({});

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [selectingWinnerId, setSelectingWinnerId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const loadResults = async () => {
    try {
      setLoading(true);

      const data = await evaluacionPostulacionService.getAll();

      const visibleResults = data.filter(
        (item) => item.estado === "COMPLETADA" || item.estado === "REVISADA"
      );

      setResults(visibleResults);

      const initialForms = {};

      visibleResults.forEach((item) => {
        initialForms[item.id] = {
          puntajeObtenido: item.puntajeObtenido ?? "",
          comentarioTecnico: item.comentarioTecnico || "",
        };
      });

      setReviewForms(initialForms);

      if (selectedResult) {
        const updatedSelected = visibleResults.find(
          (item) => item.id === selectedResult.id
        );
        setSelectedResult(updatedSelected || null);
      }
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudieron cargar los resultados.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const filteredResults = useMemo(() => {
    const value = search.toLowerCase().trim();

    return results.filter((item) => {
      const matchesSearch =
        item.postulanteNombre?.toLowerCase().includes(value) ||
        item.postulanteCorreo?.toLowerCase().includes(value) ||
        item.vacanteTitulo?.toLowerCase().includes(value) ||
        item.evaluacionTitulo?.toLowerCase().includes(value);

      const matchesStatus =
        selectedStatus === "Todos" ||
        item.estado === selectedStatus ||
        item.postulacionEstado === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [results, search, selectedStatus]);

  const pendientesRevision = results.filter(
    (item) => item.estado === "COMPLETADA"
  ).length;

  const aprobadosTecnicos = results.filter(
    (item) => item.postulacionEstado === "APROBADO_TECNICO"
  ).length;

  const seleccionados = results.filter(
    (item) => item.postulacionEstado === "SELECCIONADO"
  ).length;

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const handleReviewFormChange = (id, field, value) => {
    setReviewForms((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const validateReview = (item) => {
    const form = reviewForms[item.id] || {};

    if (form.puntajeObtenido === "" || form.puntajeObtenido === null) {
      return "Ingresa el puntaje final.";
    }

    if (Number(form.puntajeObtenido) < 0) {
      return "El puntaje no puede ser negativo.";
    }

    if (!form.comentarioTecnico?.trim()) {
      return "Agrega un comentario técnico breve.";
    }

    return null;
  };

  const handleTechnicalReview = async (item, approved) => {
    const validationError = validateReview(item);

    if (validationError) {
      showMessage(validationError, "error");
      return;
    }

    const form = reviewForms[item.id];

    try {
      setReviewingId(item.id);

      await evaluacionPostulacionService.review(item.id, {
        aprobado: approved,
        puntajeObtenido: Number(form.puntajeObtenido),
        comentarioTecnico: form.comentarioTecnico.trim(),
      });

      showMessage(
        approved
          ? "Postulante aprobado técnicamente."
          : "Postulante rechazado técnicamente.",
        "success"
      );

      await loadResults();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo registrar la revisión.",
        "error"
      );
    } finally {
      setReviewingId(null);
    }
  };

  const handleSelectWinner = async (item) => {
    const confirmed = window.confirm(
      `¿Seleccionar a "${item.postulanteNombre}" como ganador de la vacante "${item.vacanteTitulo}"?`
    );

    if (!confirmed) return;

    try {
      setSelectingWinnerId(item.id);

      await vacanteService.selectWinner(item.vacanteId, item.postulacionId);

      showMessage("Ganador seleccionado correctamente.", "success");

      await loadResults();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo seleccionar al ganador.",
        "error"
      );
    } finally {
      setSelectingWinnerId(null);
    }
  };

  const canSelectWinner = (item) => {
    return (
      item.estado === "REVISADA" &&
      item.postulacionEstado === "APROBADO_TECNICO"
    );
  };

  const formatDateTime = (value) => {
    if (!value) return "Sin fecha";

    return new Date(value).toLocaleString("es-PE", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const statusClass = (status) => {
    const styles = {
      COMPLETADA: "bg-violet-50 text-violet-700 border-violet-200",
      REVISADA: "bg-emerald-50 text-emerald-700 border-emerald-200",
      APROBADO_TECNICO: "bg-emerald-50 text-emerald-700 border-emerald-200",
      RECHAZADO_TECNICO: "bg-rose-50 text-rose-700 border-rose-200",
      SELECCIONADO: "bg-amber-50 text-amber-700 border-amber-200",
      NO_SELECCIONADO: "bg-slate-50 text-slate-600 border-slate-200",
    };

    return styles[status] || "bg-slate-50 text-slate-600 border-slate-200";
  };

  const answerClass = (answer) => {
    if (answer.esCorrecta === true) {
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    }

    if (answer.esCorrecta === false) {
      return "text-rose-700 bg-rose-50 border-rose-200";
    }

    return "text-slate-600 bg-slate-50 border-slate-200";
  };

  const answerLabel = (answer) => {
    if (answer.esCorrecta === true) return "Correcta";
    if (answer.esCorrecta === false) return "Incorrecta";
    return "Abierta";
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div>
      <SectionHeader
        title="Resultados técnicos"
        description="Revisa evaluaciones completadas, aprueba o rechaza postulantes y selecciona al ganador final."
      />

      {message && (
        <div
          className={`mb-5 border rounded-2xl px-4 py-3 text-sm font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Por revisar</p>
          <p className="text-3xl font-black text-violet-600 mt-1">
            {pendientesRevision}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">
            Aptos técnicos
          </p>
          <p className="text-3xl font-black text-emerald-600 mt-1">
            {aprobadosTecnicos}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Seleccionados</p>
          <p className="text-3xl font-black text-amber-600 mt-1">
            {seleccionados}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-[1fr_230px_auto] gap-3">
        <div className="flex items-center gap-3 border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
          <Search size={18} className="text-emerald-600" />
          <input
            type="text"
            placeholder="Buscar postulante, correo, vacante o evaluación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-sm text-slate-900"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="input-light"
        >
          <option value="Todos">Todos</option>
          <option value="COMPLETADA">Por revisar</option>
          <option value="REVISADA">Revisada</option>
          <option value="APROBADO_TECNICO">Aprobado técnico</option>
          <option value="RECHAZADO_TECNICO">Rechazado técnico</option>
          <option value="SELECCIONADO">Seleccionado</option>
          <option value="NO_SELECCIONADO">No seleccionado</option>
        </select>

        <button
          type="button"
          onClick={loadResults}
          className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-black"
        >
          <RefreshCw size={17} />
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-black text-slate-900">
            Cargando resultados...
          </h2>
          <p className="text-slate-500 mt-1">Un momento por favor.</p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-black text-slate-900">
            No hay resultados disponibles
          </h2>
          <p className="text-slate-500 mt-1">
            Cuando un postulante envíe una evaluación, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1.5fr_1.3fr_1fr_0.8fr_220px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase">
            <span>Postulante</span>
            <span>Vacante / Evaluación</span>
            <span>Estado</span>
            <span>Puntaje</span>
            <span className="text-right">Acciones</span>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredResults.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 lg:grid-cols-[1.5fr_1.3fr_1fr_0.8fr_220px] gap-4 px-5 py-4 items-center"
              >
                <div>
                  <p className="font-black text-slate-900">
                    {item.postulanteNombre}
                  </p>
                  <p className="text-sm text-slate-500">
                    {item.postulanteCorreo}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-slate-800">
                    {item.vacanteTitulo}
                  </p>
                  <p className="text-sm text-slate-500">
                    {item.evaluacionTitulo}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Enviado: {formatDateTime(item.fechaEnvio)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                      item.estado
                    )}`}
                  >
                    {item.estado}
                  </span>

                  {item.postulacionEstado && (
                    <span
                      className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                        item.postulacionEstado
                      )}`}
                    >
                      {item.postulacionEstado}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-slate-700 font-black">
                  <Star size={17} className="text-amber-500" />
                  {item.puntajeObtenido ?? 0}
                </div>

                <div className="flex flex-wrap justify-start lg:justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedResult(item)}
                    className="inline-flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-sm font-bold"
                  >
                    <Eye size={16} />
                    Ver
                  </button>

                  {canSelectWinner(item) && (
                    <button
                      type="button"
                      disabled={selectingWinnerId === item.id}
                      onClick={() => handleSelectWinner(item)}
                      className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 disabled:bg-slate-100 text-amber-700 disabled:text-slate-500 border border-amber-200 px-3 py-2 rounded-xl text-sm font-bold"
                    >
                      <Award size={16} />
                      Ganador
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center px-4 py-8">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Detalle del resultado
                </h2>
                <p className="text-sm text-slate-500">
                  {selectedResult.postulanteNombre} ·{" "}
                  {selectedResult.vacanteTitulo}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedResult(null)}
                className="w-9 h-9 rounded-xl border border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">Correo</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedResult.postulanteCorreo}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">
                    Evaluación
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedResult.evaluacionTitulo}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">
                    Puntaje actual
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedResult.puntajeObtenido ?? 0}
                  </p>
                </div>
              </section>

              <section>
                <h3 className="font-black text-slate-900 mb-3">
                  Respuestas
                </h3>

                {selectedResult.respuestas?.length === 0 ? (
                  <div className="border border-slate-200 rounded-xl p-4 text-slate-500">
                    No hay respuestas registradas.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedResult.respuestas?.map((answer, index) => (
                      <div
                        key={answer.id}
                        className="border border-slate-200 rounded-xl p-4"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div>
                            <p className="text-xs font-black text-slate-500">
                              Pregunta {index + 1}
                            </p>
                            <p className="font-bold text-slate-900 mt-1">
                              {answer.preguntaEnunciado}
                            </p>
                          </div>

                          <span
                            className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${answerClass(
                              answer
                            )}`}
                          >
                            {answerLabel(answer)}
                          </span>
                        </div>

                        <p className="text-sm text-slate-700 mt-3 whitespace-pre-wrap">
                          {answer.opcionTexto ||
                            answer.respuestaTexto ||
                            "Sin respuesta"}
                        </p>

                        <p className="text-xs text-slate-500 mt-3">
                          Puntaje obtenido:{" "}
                          <strong>{answer.puntajeObtenido ?? 0}</strong>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {selectedResult.estado === "COMPLETADA" ? (
                <section className="border border-slate-200 rounded-xl p-4">
                  <h3 className="font-black text-slate-900 mb-3">
                    Revisión técnica
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-3">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Puntaje final
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          reviewForms[selectedResult.id]?.puntajeObtenido || ""
                        }
                        onChange={(e) =>
                          handleReviewFormChange(
                            selectedResult.id,
                            "puntajeObtenido",
                            e.target.value
                          )
                        }
                        className="input-light"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Comentario
                      </label>

                      <textarea
                        value={
                          reviewForms[selectedResult.id]?.comentarioTecnico ||
                          ""
                        }
                        onChange={(e) =>
                          handleReviewFormChange(
                            selectedResult.id,
                            "comentarioTecnico",
                            e.target.value
                          )
                        }
                        placeholder="Comentario breve sobre el resultado técnico."
                        className="w-full min-h-24 border border-slate-300 rounded-xl p-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-2 mt-4">
                    <button
                      type="button"
                      disabled={reviewingId === selectedResult.id}
                      onClick={() => handleTechnicalReview(selectedResult, true)}
                      className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl text-sm font-black"
                    >
                      <UserCheck size={17} />
                      Aprobar técnico
                    </button>

                    <button
                      type="button"
                      disabled={reviewingId === selectedResult.id}
                      onClick={() =>
                        handleTechnicalReview(selectedResult, false)
                      }
                      className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl text-sm font-black"
                    >
                      <UserX size={17} />
                      Rechazar técnico
                    </button>
                  </div>
                </section>
              ) : (
                <section className="border border-emerald-200 bg-emerald-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className="text-emerald-700 shrink-0 mt-1"
                    />
                    <div>
                      <p className="font-black text-slate-900">
                        Resultado revisado
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        {selectedResult.comentarioTecnico ||
                          "Sin comentario técnico registrado."}
                      </p>
                    </div>
                  </div>

                  {canSelectWinner(selectedResult) && (
                    <button
                      type="button"
                      disabled={selectingWinnerId === selectedResult.id}
                      onClick={() => handleSelectWinner(selectedResult)}
                      className="mt-4 inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl text-sm font-black"
                    >
                      <Trophy size={17} />
                      Seleccionar como ganador
                    </button>
                  )}
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TechnicalResults;