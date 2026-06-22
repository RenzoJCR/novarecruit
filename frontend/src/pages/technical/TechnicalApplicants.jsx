import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BookOpenCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Send,
  UserRoundCheck,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { postulacionService } from "../../services/postulacionService.js";
import { evaluacionService } from "../../services/evaluacionService.js";
import { evaluacionPostulacionService } from "../../services/evaluacionPostulacionService.js";
import { logService } from "../../services/logService.js";

function TechnicalApplicants() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [logs, setLogs] = useState([]);

  const [selectedEvaluations, setSelectedEvaluations] = useState({});
  const [search, setSearch] = useState("");

  const [loadingPostulaciones, setLoadingPostulaciones] = useState(true);
  const [loadingEvaluaciones, setLoadingEvaluaciones] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [assigningId, setAssigningId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const postulacionesAprobadas = useMemo(() => {
    return postulaciones.filter(
      (postulacion) => postulacion.estado === "APROBADO_RRHH"
    );
  }, [postulaciones]);

  const filteredPostulaciones = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return postulacionesAprobadas;

    return postulacionesAprobadas.filter((postulacion) => {
      return (
        postulacion.postulanteNombre?.toLowerCase().includes(value) ||
        postulacion.postulanteCorreo?.toLowerCase().includes(value) ||
        postulacion.vacanteTitulo?.toLowerCase().includes(value) ||
        postulacion.areaNombre?.toLowerCase().includes(value)
      );
    });
  }, [postulacionesAprobadas, search]);

  const loadPostulaciones = async () => {
    try {
      setLoadingPostulaciones(true);
      const data = await postulacionService.getAll();
      setPostulaciones(data);
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudieron cargar las postulaciones.",
        "error"
      );
    } finally {
      setLoadingPostulaciones(false);
    }
  };

  const loadEvaluaciones = async () => {
    try {
      setLoadingEvaluaciones(true);
      const data = await evaluacionService.getActive();
      setEvaluaciones(data);
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudieron cargar las evaluaciones.",
        "error"
      );
    } finally {
      setLoadingEvaluaciones(false);
    }
  };

  const loadLogs = async () => {
    try {
      setLoadingLogs(true);
      const data = await logService.getLatest();
      const evaluationLogs = data
        .filter((log) => log.modulo === "EVALUACIONES")
        .slice(0, 5);
      setLogs(evaluationLogs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const refreshData = async () => {
    await Promise.all([loadPostulaciones(), loadEvaluaciones(), loadLogs()]);
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

  const handleSelectEvaluation = (postulacionId, evaluacionId) => {
    setSelectedEvaluations((prev) => ({
      ...prev,
      [postulacionId]: evaluacionId,
    }));
  };

  const getEvaluacionesByVacante = (vacanteId) => {
    return evaluaciones.filter(
      (evaluacion) =>
        Number(evaluacion.vacanteId) === Number(vacanteId) &&
        evaluacion.estado === "ACTIVA"
    );
  };

  const handleAssign = async (postulacion) => {
    const evaluacionId = selectedEvaluations[postulacion.id];

    if (!evaluacionId) {
      showMessage("Selecciona una evaluación para asignar.", "error");
      return;
    }

    try {
      setAssigningId(postulacion.id);

      await evaluacionPostulacionService.assign({
        postulacionId: postulacion.id,
        evaluacionId: Number(evaluacionId),
      });

      showMessage("Evaluación asignada correctamente.", "success");

      setSelectedEvaluations((prev) => ({
        ...prev,
        [postulacion.id]: "",
      }));

      await refreshData();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo asignar la evaluación.",
        "error"
      );
    } finally {
      setAssigningId(null);
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

  const loading = loadingPostulaciones || loadingEvaluaciones;

  return (
    <div>
      <SectionHeader
        title="Postulantes para evaluación"
        description="Asigna evaluaciones técnicas a postulantes aprobados por Recursos Humanos."
      />

      {message && (
        <div
          className={`mb-5 border rounded-3xl px-5 py-4 font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">
            Aprobados por RRHH
          </p>
          <p className="text-4xl font-black text-emerald-600 mt-2">
            {postulacionesAprobadas.length}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">
            Evaluaciones activas
          </p>
          <p className="text-4xl font-black text-sky-600 mt-2">
            {evaluaciones.length}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Resultados</p>
          <p className="text-4xl font-black text-slate-900 mt-2">
            {filteredPostulaciones.length}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] p-5 mb-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 shadow-sm">
        <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
          <Search size={18} className="text-emerald-600" />
          <input
            type="text"
            placeholder="Buscar por postulante, correo, vacante o área..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-slate-900"
          />
        </div>

        <button
          type="button"
          onClick={refreshData}
          className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-2xl font-black"
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-900">
            Cargando postulantes...
          </h2>
          <p className="text-slate-500 mt-2">
            Consultando postulaciones y evaluaciones desde MySQL.
          </p>
        </div>
      ) : filteredPostulaciones.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center shadow-sm">
          <UserRoundCheck size={42} className="mx-auto text-emerald-600" />
          <h2 className="text-2xl font-black text-slate-900 mt-4">
            No hay postulantes pendientes de evaluación
          </h2>
          <p className="text-slate-500 mt-2">
            Cuando RRHH apruebe postulaciones, aparecerán aquí para asignarles
            una evaluación técnica.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPostulaciones.map((postulacion) => {
            const evaluacionesVacante = getEvaluacionesByVacante(
              postulacion.vacanteId
            );

            return (
              <article
                key={postulacion.id}
                className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                  <div>
                    <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black mb-3">
                      {postulacion.areaNombre}
                    </span>

                    <h3 className="text-2xl font-black text-slate-900">
                      {postulacion.postulanteNombre}
                    </h3>

                    <p className="text-slate-500 mt-1">
                      {postulacion.postulanteCorreo}
                    </p>

                    <p className="text-slate-700 font-bold mt-4">
                      {postulacion.vacanteTitulo}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                      <Clock size={16} className="text-emerald-600" />
                      Postuló: {formatDateTime(postulacion.fechaPostulacion)}
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-black bg-emerald-50 text-emerald-700 border-emerald-200">
                    <CheckCircle2 size={18} />
                    {postulacion.estado}
                  </span>
                </div>

                <div className="mt-6">
                  <h4 className="font-black text-slate-900 mb-3">
                    Habilidades declaradas
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {postulacion.habilidades?.map((item) => (
                      <span
                        key={item.id}
                        className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold"
                      >
                        {item.habilidadNombre} · {item.nivelPostulante} ·{" "}
                        {item.aniosExperiencia || 0} año(s)
                      </span>
                    ))}
                  </div>
                </div>

                {postulacion.comentarioRrhh && (
                  <div className="mt-6 rounded-3xl bg-slate-50 border border-slate-200 p-4">
                    <p className="font-black text-slate-900">
                      Comentario de RRHH
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {postulacion.comentarioRrhh}
                    </p>
                  </div>
                )}

                <div className="mt-6 rounded-3xl bg-slate-50 border border-slate-200 p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <BookOpenCheck size={22} />
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900">
                        Asignar evaluación técnica
                      </h4>
                      <p className="text-sm text-slate-500">
                        Solo se muestran evaluaciones creadas para esta misma
                        vacante.
                      </p>
                    </div>
                  </div>

                  {evaluacionesVacante.length === 0 ? (
                    <div className="rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 p-4 font-semibold">
                      No hay evaluaciones activas para esta vacante. Primero
                      crea una evaluación técnica para poder asignarla.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
                      <select
                        value={selectedEvaluations[postulacion.id] || ""}
                        onChange={(e) =>
                          handleSelectEvaluation(postulacion.id, e.target.value)
                        }
                        className="input-light"
                      >
                        <option value="">Selecciona una evaluación</option>
                        {evaluacionesVacante.map((evaluacion) => (
                          <option key={evaluacion.id} value={evaluacion.id}>
                            {evaluacion.titulo} · {evaluacion.preguntas?.length || 0} pregunta(s)
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleAssign(postulacion)}
                        disabled={assigningId === postulacion.id}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 disabled:from-slate-300 disabled:to-slate-300 text-white px-5 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20 disabled:shadow-none"
                      >
                        <Send size={18} />
                        {assigningId === postulacion.id
                          ? "Asignando..."
                          : "Asignar"}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <section className="mt-8 bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center">
            <Activity size={24} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900">
              Logs recientes de evaluaciones
            </h2>
            <p className="text-sm text-slate-500">
              Actividad registrada al crear, asignar o revisar evaluaciones.
            </p>
          </div>
        </div>

        {loadingLogs ? (
          <p className="text-slate-500">Cargando logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-slate-500">
            No hay logs recientes de evaluaciones.
          </p>
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

export default TechnicalApplicants;