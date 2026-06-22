import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpenCheck,
  Calendar,
  CheckCircle2,
  Clock,
  FileQuestion,
  RefreshCw,
  Search,
  Send,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { evaluacionPostulacionService } from "../../services/evaluacionPostulacionService.js";

const TEMP_POSTULANTE_ID = 4;

function ApplicantEvaluations() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const filteredEvaluaciones = useMemo(() => {
    const value = search.toLowerCase().trim();

    return evaluaciones.filter((item) => {
      const matchesSearch =
        item.evaluacionTitulo?.toLowerCase().includes(value) ||
        item.vacanteTitulo?.toLowerCase().includes(value);

      const matchesStatus =
        selectedStatus === "Todos" || item.estado === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [evaluaciones, search, selectedStatus]);

  const pendingCount = evaluaciones.filter(
    (item) => item.estado === "ASIGNADA" || item.estado === "EN_PROCESO"
  ).length;

  const completedCount = evaluaciones.filter(
    (item) => item.estado === "COMPLETADA"
  ).length;

  const reviewedCount = evaluaciones.filter(
    (item) => item.estado === "REVISADA"
  ).length;

  const loadEvaluaciones = async () => {
    try {
      setLoading(true);
      const data = await evaluacionPostulacionService.getByPostulante(
        TEMP_POSTULANTE_ID
      );
      setEvaluaciones(data);
    } catch (error) {
      setMessage(error.userMessage || "No se pudieron cargar tus evaluaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvaluaciones();
  }, []);

  const formatDateTime = (value) => {
    if (!value) return "Sin fecha";

    return new Date(value).toLocaleString("es-PE", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const statusClass = (status) => {
    const styles = {
      ASIGNADA: "bg-sky-50 text-sky-700 border-sky-200",
      EN_PROCESO: "bg-amber-50 text-amber-700 border-amber-200",
      COMPLETADA: "bg-violet-50 text-violet-700 border-violet-200",
      REVISADA: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };

    return styles[status] || "bg-slate-50 text-slate-600 border-slate-200";
  };

  const statusIcon = (status) => {
    if (status === "REVISADA") return <CheckCircle2 size={18} />;
    if (status === "COMPLETADA") return <BookOpenCheck size={18} />;
    return <Clock size={18} />;
  };

  const canSolve = (status) => {
    return status === "ASIGNADA" || status === "EN_PROCESO";
  };

  return (
    <div>
      <SectionHeader
        title="Mis evaluaciones técnicas"
        description="Resuelve las evaluaciones asignadas por el líder técnico."
      />

      {message && (
        <div className="mb-5 border border-rose-200 bg-rose-50 text-rose-700 rounded-3xl px-5 py-4 font-semibold">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Pendientes</p>
          <p className="text-4xl font-black text-sky-600 mt-2">
            {pendingCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Completadas</p>
          <p className="text-4xl font-black text-violet-600 mt-2">
            {completedCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Revisadas</p>
          <p className="text-4xl font-black text-emerald-600 mt-2">
            {reviewedCount}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] p-5 mb-8 grid grid-cols-1 md:grid-cols-[1fr_240px_auto] gap-4 shadow-sm">
        <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
          <Search size={18} className="text-emerald-600" />
          <input
            type="text"
            placeholder="Buscar por evaluación o vacante..."
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
          <option value="ASIGNADA">Asignada</option>
          <option value="EN_PROCESO">En proceso</option>
          <option value="COMPLETADA">Completada</option>
          <option value="REVISADA">Revisada</option>
        </select>

        <button
          type="button"
          onClick={loadEvaluaciones}
          className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-2xl font-black"
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
          <h2 className="text-2xl font-black text-slate-900">
            Cargando evaluaciones...
          </h2>
          <p className="text-slate-500 mt-2">
            Consultando asignaciones desde MySQL.
          </p>
        </div>
      ) : filteredEvaluaciones.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
          <FileQuestion size={42} className="mx-auto text-emerald-600" />
          <h2 className="text-2xl font-black text-slate-900 mt-4">
            No tienes evaluaciones asignadas
          </h2>
          <p className="text-slate-500 mt-2">
            Cuando el líder técnico te asigne una evaluación, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredEvaluaciones.map((item) => (
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
                    {item.evaluacionTitulo}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-3">
                    <Calendar size={17} className="text-emerald-600" />
                    Asignada: {formatDateTime(item.fechaAsignacion)}
                  </div>

                  {item.fechaEnvio && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                      <Send size={17} className="text-emerald-600" />
                      Enviada: {formatDateTime(item.fechaEnvio)}
                    </div>
                  )}
                </div>

                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-black ${statusClass(
                    item.estado
                  )}`}
                >
                  {statusIcon(item.estado)}
                  {item.estado}
                </span>
              </div>

              <div className="mt-6 rounded-3xl bg-slate-50 border border-slate-200 p-4">
                <p className="font-black text-slate-900">Resultado</p>

                <p className="text-sm text-slate-600 mt-1">
                  Puntaje obtenido:{" "}
                  <strong>{item.puntajeObtenido ?? "Pendiente"}</strong>
                </p>

                {item.comentarioTecnico && (
                  <p className="text-sm text-slate-600 mt-2">
                    <strong>Comentario técnico:</strong>{" "}
                    {item.comentarioTecnico}
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  to={`/applicant/evaluaciones/${item.id}`}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black ${
                    canSolve(item.estado)
                      ? "bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white shadow-xl shadow-emerald-500/20"
                      : "border border-slate-300 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <BookOpenCheck size={18} />
                  {canSolve(item.estado) ? "Resolver evaluación" : "Ver detalle"}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApplicantEvaluations;