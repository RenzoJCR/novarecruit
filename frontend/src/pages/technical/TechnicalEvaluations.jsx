import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  BookOpenCheck,
  Briefcase,
  Calendar,
  Clock,
  FileQuestion,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { evaluacionService } from "../../services/evaluacionService.js";
import { logService } from "../../services/logService.js";

function TechnicalEvaluations() {
  const navigate = useNavigate();

  const [evaluaciones, setEvaluaciones] = useState([]);
  const [logs, setLogs] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  const [loadingEvaluaciones, setLoadingEvaluaciones] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const filteredEvaluaciones = useMemo(() => {
    const value = search.toLowerCase().trim();

    return evaluaciones.filter((evaluacion) => {
      const matchesSearch =
        evaluacion.titulo?.toLowerCase().includes(value) ||
        evaluacion.vacanteTitulo?.toLowerCase().includes(value) ||
        evaluacion.tecnicoNombre?.toLowerCase().includes(value);

      const matchesStatus =
        selectedStatus === "Todos" || evaluacion.estado === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [evaluaciones, search, selectedStatus]);

  const activeCount = evaluaciones.filter(
    (evaluacion) => evaluacion.estado === "ACTIVA"
  ).length;

  const inactiveCount = evaluaciones.filter(
    (evaluacion) => evaluacion.estado === "INACTIVA"
  ).length;

  const totalQuestions = evaluaciones.reduce(
    (total, evaluacion) => total + (evaluacion.preguntas?.length || 0),
    0
  );

  const loadEvaluaciones = async () => {
    try {
      setLoadingEvaluaciones(true);
      const data = await evaluacionService.getAll();
      setEvaluaciones(data);
    } catch (error) {
      console.error("Error cargando evaluaciones:", error);
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
      console.error("Error cargando logs:", error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const refreshData = async () => {
    await Promise.all([loadEvaluaciones(), loadLogs()]);
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

  const handleDeactivate = async (evaluacion) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas desactivar la evaluación "${evaluacion.titulo}"?`
    );

    if (!confirmed) return;

    try {
      await evaluacionService.deactivate(evaluacion.id);
      showMessage("Evaluación desactivada correctamente.", "success");
      await refreshData();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo desactivar la evaluación.",
        "error"
      );
    }
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
      ACTIVA: "bg-emerald-50 text-emerald-700 border-emerald-200",
      INACTIVA: "bg-slate-50 text-slate-600 border-slate-200",
    };

    return styles[status] || "bg-slate-50 text-slate-600 border-slate-200";
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div>
      <SectionHeader
        title="Evaluaciones técnicas"
        description="Gestiona evaluaciones asociadas a vacantes y preparadas para los postulantes aprobados por RRHH."
        action={
          <button
            onClick={() => navigate("/technical/evaluaciones/create")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white px-5 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20"
          >
            <Plus size={18} />
            Crear evaluación
          </button>
        }
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
          <p className="text-sm text-slate-500 font-semibold">Evaluaciones</p>
          <p className="text-4xl font-black text-slate-900 mt-2">
            {evaluaciones.length}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Activas</p>
          <p className="text-4xl font-black text-emerald-600 mt-2">
            {activeCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Preguntas</p>
          <p className="text-4xl font-black text-sky-600 mt-2">
            {totalQuestions}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] p-5 mb-8 grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-4 shadow-sm">
        <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
          <Search size={18} className="text-emerald-600" />
          <input
            type="text"
            placeholder="Buscar por evaluación, vacante o técnico..."
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
          <option value="ACTIVA">Activa</option>
          <option value="INACTIVA">Inactiva</option>
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

      {loadingEvaluaciones ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
          <h2 className="text-2xl font-black text-slate-900">
            Cargando evaluaciones...
          </h2>
          <p className="text-slate-500 mt-2">
            Consultando información desde MySQL.
          </p>
        </div>
      ) : filteredEvaluaciones.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
          <h2 className="text-2xl font-black text-slate-900">
            No se encontraron evaluaciones
          </h2>
          <p className="text-slate-500 mt-2">
            Crea una evaluación para una vacante activa.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredEvaluaciones.map((evaluacion) => (
            <article
              key={evaluacion.id}
              className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black mb-3">
                    {evaluacion.vacanteTitulo}
                  </span>

                  <h3 className="text-2xl font-black text-slate-900">
                    {evaluacion.titulo}
                  </h3>

                  <p className="text-slate-500 mt-2 leading-relaxed line-clamp-3">
                    {evaluacion.descripcion || "Sin descripción registrada."}
                  </p>
                </div>

                <span
                  className={`inline-flex px-3 py-1.5 rounded-full border text-xs font-black ${statusClass(
                    evaluacion.estado
                  )}`}
                >
                  {evaluacion.estado}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock size={17} className="text-emerald-600" />
                  {evaluacion.duracionMinutos} min
                </div>

                <div className="flex items-center gap-2">
                  <BookOpenCheck size={17} className="text-emerald-600" />
                  Puntaje máx: {evaluacion.puntajeMaximo}
                </div>

                <div className="flex items-center gap-2">
                  <FileQuestion size={17} className="text-emerald-600" />
                  {evaluacion.preguntas?.length || 0} pregunta(s)
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={17} className="text-emerald-600" />
                  {formatDateTime(evaluacion.createdAt)}
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-slate-50 border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Briefcase size={17} className="text-emerald-600" />
                  Técnico: {evaluacion.tecnicoNombre}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-black text-slate-900 mb-3">
                  Preguntas registradas
                </h4>

                <div className="space-y-2">
                  {evaluacion.preguntas?.slice(0, 3).map((pregunta) => (
                    <div
                      key={pregunta.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <p className="text-sm font-bold text-slate-800">
                        {pregunta.orden}. {pregunta.enunciado}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {pregunta.tipoPregunta} · {pregunta.puntaje} pts
                      </p>
                    </div>
                  ))}

                  {(evaluacion.preguntas?.length || 0) > 3 && (
                    <p className="text-sm text-slate-500">
                      + {evaluacion.preguntas.length - 3} pregunta(s) más
                    </p>
                  )}
                </div>
              </div>

              {evaluacion.estado === "ACTIVA" && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDeactivate(evaluacion)}
                    className="inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 px-4 py-2 rounded-2xl font-black"
                  >
                    <Trash2 size={17} />
                    Desactivar
                  </button>
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
              Logs recientes de evaluaciones
            </h2>
            <p className="text-sm text-slate-500">
              Actividad registrada desde el backend.
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

export default TechnicalEvaluations;