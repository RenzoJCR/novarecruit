import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Award,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  FileText,
  RefreshCw,
  Search,
  Star,
  Trophy,
  UserCheck,
  UserX,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { evaluacionPostulacionService } from "../../services/evaluacionPostulacionService.js";
import { logService } from "../../services/logService.js";
import { vacanteService } from "../../services/vacanteService.js";

function TechnicalResults() {
  const [results, setResults] = useState([]);
  const [logs, setLogs] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [reviewForms, setReviewForms] = useState({});

  const [loadingResults, setLoadingResults] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [selectingWinnerId, setSelectingWinnerId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

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

  const completedCount = results.filter(
    (item) => item.estado === "COMPLETADA"
  ).length;

  const approvedTechnicalCount = results.filter(
    (item) => item.postulacionEstado === "APROBADO_TECNICO"
  ).length;

  const selectedCount = results.filter(
    (item) => item.postulacionEstado === "SELECCIONADO"
  ).length;

  const averageScore = useMemo(() => {
    const scores = results
      .map((item) => Number(item.puntajeObtenido))
      .filter((score) => !Number.isNaN(score));

    if (scores.length === 0) return 0;

    const total = scores.reduce((sum, score) => sum + score, 0);
    return (total / scores.length).toFixed(1);
  }, [results]);

  const loadResults = async () => {
    try {
      setLoadingResults(true);

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
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudieron cargar los resultados técnicos.",
        "error"
      );
    } finally {
      setLoadingResults(false);
    }
  };

  const loadLogs = async () => {
    try {
      setLoadingLogs(true);
      const data = await logService.getLatest();

      const relevantLogs = data
        .filter((log) => log.modulo === "EVALUACIONES" || log.modulo === "VACANTES")
        .slice(0, 6);

      setLogs(relevantLogs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const refreshData = async () => {
    await Promise.all([loadResults(), loadLogs()]);
  };

  useEffect(() => {
    refreshData();
  }, []);

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
      return "Ingresa el puntaje obtenido.";
    }

    if (Number(form.puntajeObtenido) < 0) {
      return "El puntaje no puede ser negativo.";
    }

    if (!form.comentarioTecnico?.trim()) {
      return "Agrega un comentario técnico antes de revisar.";
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
          ? "Resultado aprobado técnicamente."
          : "Resultado rechazado técnicamente.",
        "success"
      );

      await refreshData();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo revisar el resultado técnico.",
        "error"
      );
    } finally {
      setReviewingId(null);
    }
  };

  const handleSelectWinner = async (item) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas seleccionar a "${item.postulanteNombre}" como ganador de la vacante "${item.vacanteTitulo}"? Esta acción cerrará la vacante.`
    );

    if (!confirmed) return;

    try {
      setSelectingWinnerId(item.id);

      await vacanteService.selectWinner(item.vacanteId, item.postulacionId);

      showMessage("Ganador seleccionado correctamente. La vacante fue cerrada.", "success");

      await refreshData();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo seleccionar al ganador.",
        "error"
      );
    } finally {
      setSelectingWinnerId(null);
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "Sin fecha";

    return new Date(value).toLocaleString("es-PE", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const evaluationStatusClass = (status) => {
    const styles = {
      COMPLETADA: "bg-violet-50 text-violet-700 border-violet-200",
      REVISADA: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };

    return styles[status] || "bg-slate-50 text-slate-600 border-slate-200";
  };

  const applicationStatusClass = (status) => {
    const styles = {
      APROBADO_TECNICO: "bg-emerald-50 text-emerald-700 border-emerald-200",
      RECHAZADO_TECNICO: "bg-rose-50 text-rose-700 border-rose-200",
      SELECCIONADO: "bg-amber-50 text-amber-700 border-amber-200",
      NO_SELECCIONADO: "bg-slate-50 text-slate-600 border-slate-200",
    };

    return styles[status] || "bg-slate-50 text-slate-600 border-slate-200";
  };

  const answerStatusClass = (answer) => {
    if (answer.esCorrecta === true) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (answer.esCorrecta === false) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }

    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  const answerStatusText = (answer) => {
    if (answer.esCorrecta === true) return "Correcta";
    if (answer.esCorrecta === false) return "Incorrecta";
    return "Respuesta abierta";
  };

  const canSelectWinner = (item) => {
    return item.estado === "REVISADA" && item.postulacionEstado === "APROBADO_TECNICO";
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
        description="Revisa evaluaciones completadas y selecciona al ganador final de cada vacante."
      />

      {message && (
        <div
          className={`mb-5 border rounded-3xl px-5 py-4 font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Por revisar</p>
          <p className="text-4xl font-black text-violet-600 mt-2">
            {completedCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">
            Aptos técnicamente
          </p>
          <p className="text-4xl font-black text-emerald-600 mt-2">
            {approvedTechnicalCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Seleccionados</p>
          <p className="text-4xl font-black text-amber-600 mt-2">
            {selectedCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Promedio</p>
          <p className="text-4xl font-black text-slate-900 mt-2">
            {averageScore}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] p-5 mb-8 grid grid-cols-1 md:grid-cols-[1fr_260px_auto] gap-4 shadow-sm">
        <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
          <Search size={18} className="text-emerald-600" />
          <input
            type="text"
            placeholder="Buscar por postulante, correo, vacante o evaluación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-slate-900"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="input-light"
        >
          <option value="Todos">Todos los estados</option>
          <option value="COMPLETADA">Completada</option>
          <option value="REVISADA">Revisada</option>
          <option value="APROBADO_TECNICO">Aprobado técnico</option>
          <option value="RECHAZADO_TECNICO">Rechazado técnico</option>
          <option value="SELECCIONADO">Seleccionado</option>
          <option value="NO_SELECCIONADO">No seleccionado</option>
        </select>

        <button
          type="button"
          onClick={refreshData}
          className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-2xl font-black"
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {loadingResults ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-900">
            Cargando resultados...
          </h2>
          <p className="text-slate-500 mt-2">
            Consultando evaluaciones completadas desde MySQL.
          </p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center shadow-sm">
          <BookOpenCheck size={42} className="mx-auto text-emerald-600" />
          <h2 className="text-2xl font-black text-slate-900 mt-4">
            No hay resultados para revisar
          </h2>
          <p className="text-slate-500 mt-2">
            Cuando un postulante complete una evaluación, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredResults.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div>
                  <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black mb-3">
                    {item.vacanteTitulo}
                  </span>

                  <h3 className="text-2xl font-black text-slate-900">
                    {item.postulanteNombre}
                  </h3>

                  <p className="text-slate-500 mt-1">
                    {item.postulanteCorreo}
                  </p>

                  <p className="font-black text-slate-800 mt-4">
                    {item.evaluacionTitulo}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-3">
                    <span className="inline-flex items-center gap-2">
                      <Clock size={16} className="text-emerald-600" />
                      Enviada: {formatDateTime(item.fechaEnvio)}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <Star size={16} className="text-emerald-600" />
                      Puntaje: {item.puntajeObtenido ?? 0}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span
                    className={`inline-flex items-center justify-center px-4 py-2 rounded-full border text-sm font-black ${evaluationStatusClass(
                      item.estado
                    )}`}
                  >
                    {item.estado}
                  </span>

                  {item.postulacionEstado && (
                    <span
                      className={`inline-flex items-center justify-center px-4 py-2 rounded-full border text-sm font-black ${applicationStatusClass(
                        item.postulacionEstado
                      )}`}
                    >
                      {item.postulacionEstado}
                    </span>
                  )}
                </div>
              </div>

              {item.postulacionEstado === "SELECCIONADO" && (
                <div className="mt-6 rounded-3xl bg-amber-50 border border-amber-200 p-5">
                  <div className="flex items-start gap-3">
                    <Trophy size={26} className="text-amber-600 shrink-0 mt-1" />
                    <div>
                      <p className="font-black text-slate-900">
                        Ganador seleccionado
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        Este postulante fue seleccionado como ganador final de
                        la vacante.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <h4 className="font-black text-slate-900 mb-3">
                  Respuestas del postulante
                </h4>

                {item.respuestas?.length === 0 ? (
                  <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4 text-slate-500">
                    No hay respuestas registradas.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {item.respuestas?.map((answer, index) => (
                      <div
                        key={answer.id}
                        className="rounded-3xl bg-slate-50 border border-slate-200 p-4"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div>
                            <p className="text-xs font-black text-slate-500">
                              Pregunta {index + 1}
                            </p>

                            <p className="font-black text-slate-900 mt-1">
                              {answer.preguntaEnunciado}
                            </p>
                          </div>

                          <span
                            className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${answerStatusClass(
                              answer
                            )}`}
                          >
                            {answerStatusText(answer)}
                          </span>
                        </div>

                        <div className="mt-4 rounded-2xl bg-white border border-slate-200 p-4">
                          <p className="text-xs font-black text-slate-500">
                            Respuesta
                          </p>

                          <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">
                            {answer.opcionTexto ||
                              answer.respuestaTexto ||
                              "Sin respuesta"}
                          </p>
                        </div>

                        <p className="text-sm text-slate-500 mt-3">
                          Puntaje obtenido en esta pregunta:{" "}
                          <strong>{answer.puntajeObtenido ?? 0}</strong>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {item.estado === "REVISADA" ? (
                <div className="mt-6 rounded-3xl bg-emerald-50 border border-emerald-100 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={22}
                      className="text-emerald-600 shrink-0 mt-1"
                    />

                    <div>
                      <p className="font-black text-slate-900">
                        Evaluación revisada
                      </p>

                      <p className="text-sm text-slate-600 mt-1">
                        Puntaje final:{" "}
                        <strong>{item.puntajeObtenido ?? "Sin puntaje"}</strong>
                      </p>

                      {item.comentarioTecnico && (
                        <p className="text-sm text-slate-600 mt-2">
                          <strong>Comentario:</strong>{" "}
                          {item.comentarioTecnico}
                        </p>
                      )}
                    </div>
                  </div>

                  {canSelectWinner(item) && (
                    <button
                      type="button"
                      disabled={selectingWinnerId === item.id}
                      onClick={() => handleSelectWinner(item)}
                      className="mt-5 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 disabled:from-slate-300 disabled:to-slate-300 text-white px-5 py-3 rounded-2xl font-black shadow-xl shadow-amber-500/20 disabled:shadow-none"
                    >
                      <Award size={18} />
                      {selectingWinnerId === item.id
                        ? "Seleccionando..."
                        : "Seleccionar como ganador"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-6 rounded-3xl bg-slate-50 border border-slate-200 p-5">
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileText size={22} />
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900">
                        Revisión técnica final
                      </h4>
                      <p className="text-sm text-slate-500">
                        Define el puntaje final y el resultado técnico del
                        postulante.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Puntaje final *
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={reviewForms[item.id]?.puntajeObtenido || ""}
                        onChange={(e) =>
                          handleReviewFormChange(
                            item.id,
                            "puntajeObtenido",
                            e.target.value
                          )
                        }
                        className="input-light"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Comentario técnico *
                      </label>

                      <textarea
                        value={reviewForms[item.id]?.comentarioTecnico || ""}
                        onChange={(e) =>
                          handleReviewFormChange(
                            item.id,
                            "comentarioTecnico",
                            e.target.value
                          )
                        }
                        placeholder="Ej: Demuestra buen manejo técnico para el puesto."
                        className="w-full min-h-24 border border-slate-300 rounded-2xl p-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 mt-5">
                    <button
                      type="button"
                      disabled={reviewingId === item.id}
                      onClick={() => handleTechnicalReview(item, true)}
                      className="inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 disabled:bg-slate-100 text-emerald-700 disabled:text-slate-500 border border-emerald-100 px-5 py-3 rounded-2xl font-black"
                    >
                      <UserCheck size={18} />
                      {reviewingId === item.id
                        ? "Revisando..."
                        : "Aprobar técnicamente"}
                    </button>

                    <button
                      type="button"
                      disabled={reviewingId === item.id}
                      onClick={() => handleTechnicalReview(item, false)}
                      className="inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 disabled:bg-slate-100 text-rose-700 disabled:text-slate-500 border border-rose-100 px-5 py-3 rounded-2xl font-black"
                    >
                      <UserX size={18} />
                      Rechazar técnicamente
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <section className="mt-8 bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center">
            <Activity size={24} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900">
              Logs recientes
            </h2>

            <p className="text-sm text-slate-500">
              Actividad registrada al enviar, revisar y cerrar vacantes.
            </p>
          </div>
        </div>

        {loadingLogs ? (
          <p className="text-slate-500">Cargando logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-slate-500">No hay logs recientes.</p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl bg-slate-50 border border-slate-200 p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <p className="font-black text-slate-900">{log.accion}</p>

                  <span className="text-xs text-slate-400">
                    {formatDateTime(log.fechaHora)}
                  </span>
                </div>

                <p className="text-sm text-slate-500 mt-1">
                  {log.descripcion}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TechnicalResults;