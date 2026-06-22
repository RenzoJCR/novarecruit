import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpenCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  RefreshCw,
  Search,
  Send,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { evaluacionPostulacionService } from "../../services/evaluacionPostulacionService.js";
import { useAuth } from "../../context/AuthContext.jsx";

function getEstadoVisible(estado) {
  const labels = {
    ASIGNADA: "Pendiente",
    EN_PROCESO: "En proceso",
    COMPLETADA: "Enviada",
    REVISADA: "Revisada",
  };

  return labels[estado] || estado || "Sin estado";
}

function statusClass(estado) {
  const styles = {
    ASIGNADA: "bg-sky-50 text-sky-700 border-sky-200",
    EN_PROCESO: "bg-amber-50 text-amber-700 border-amber-200",
    COMPLETADA: "bg-violet-50 text-violet-700 border-violet-200",
    REVISADA: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return styles[estado] || "bg-slate-50 text-slate-600 border-slate-200";
}

function formatDateTime(value) {
  if (!value) return "Sin fecha";

  return new Date(value).toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function canSolve(status) {
  return status === "ASIGNADA" || status === "EN_PROCESO";
}

function ApplicantEvaluations() {
  const { currentUser } = useAuth();

  const [evaluaciones, setEvaluaciones] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadEvaluaciones = async () => {
    if (!currentUser?.id) {
      setMessage("No se encontró el usuario autenticado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await evaluacionPostulacionService.getByPostulante(
        currentUser.id
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
  }, [currentUser?.id]);

  const filteredEvaluaciones = useMemo(() => {
    const value = search.toLowerCase().trim();

    return evaluaciones.filter((item) => {
      const estadoVisible = getEstadoVisible(item.estado).toLowerCase();

      const matchesSearch =
        item.evaluacionTitulo?.toLowerCase().includes(value) ||
        item.vacanteTitulo?.toLowerCase().includes(value) ||
        estadoVisible.includes(value);

      const matchesStatus =
        selectedStatus === "Todos" || item.estado === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [evaluaciones, search, selectedStatus]);

  const pendientes = evaluaciones.filter((item) =>
    ["ASIGNADA", "EN_PROCESO"].includes(item.estado)
  ).length;

  const enviadas = evaluaciones.filter(
    (item) => item.estado === "COMPLETADA"
  ).length;

  const revisadas = evaluaciones.filter((item) => item.estado === "REVISADA")
    .length;

  return (
    <div>
      <SectionHeader
        title="Mis evaluaciones"
        description="Revisa tus evaluaciones asignadas y envíalas dentro del proceso."
      />

      {message && (
        <div className="mb-5 border border-rose-200 bg-rose-50 text-rose-700 rounded-2xl px-4 py-3 text-sm font-semibold">
          {message}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Pendientes</p>
          <p className="text-3xl font-black text-sky-600 mt-1">{pendientes}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Enviadas</p>
          <p className="text-3xl font-black text-violet-600 mt-1">
            {enviadas}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Revisadas</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">
            {revisadas}
          </p>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3">
        <div className="flex items-center gap-3 border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100">
          <Search size={18} className="text-sky-600" />
          <input
            type="text"
            placeholder="Buscar evaluación o vacante..."
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
          <option value="ASIGNADA">Pendientes</option>
          <option value="EN_PROCESO">En proceso</option>
          <option value="COMPLETADA">Enviadas</option>
          <option value="REVISADA">Revisadas</option>
        </select>

        <button
          type="button"
          onClick={loadEvaluaciones}
          className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-black"
        >
          <RefreshCw size={17} />
          Actualizar
        </button>
      </section>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-black text-slate-900">
            Cargando evaluaciones...
          </h2>
          <p className="text-slate-500 mt-1">Un momento por favor.</p>
        </div>
      ) : filteredEvaluaciones.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <BookOpenCheck size={36} className="mx-auto text-sky-600" />
          <h2 className="text-xl font-black text-slate-900 mt-3">
            No tienes evaluaciones asignadas
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Cuando avances en una postulación, aquí aparecerán tus evaluaciones.
          </p>
        </div>
      ) : (
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_160px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase">
            <span>Evaluación</span>
            <span>Vacante</span>
            <span>Estado</span>
            <span>Puntaje</span>
            <span className="text-right">Acción</span>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredEvaluaciones.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_0.8fr_0.8fr_160px] gap-4 px-5 py-4 items-center"
              >
                <div>
                  <p className="font-black text-slate-900">
                    {item.evaluacionTitulo}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 inline-flex items-center gap-1">
                    <Calendar size={14} />
                    Asignada: {formatDateTime(item.fechaAsignacion)}
                  </p>
                  {item.fechaEnvio && (
                    <p className="text-xs text-slate-400 mt-1 inline-flex items-center gap-1">
                      <Send size={14} />
                      Enviada: {formatDateTime(item.fechaEnvio)}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-700">
                    {item.vacanteTitulo}
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                      item.estado
                    )}`}
                  >
                    {getEstadoVisible(item.estado)}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-black text-slate-800">
                    {item.puntajeObtenido ?? "Pendiente"}
                  </p>
                </div>

                <div className="flex justify-start lg:justify-end">
                  <Link
                    to={`/applicant/evaluaciones/${item.id}`}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold ${
                      canSolve(item.estado)
                        ? "bg-sky-600 hover:bg-sky-700 text-white"
                        : "border border-slate-300 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {canSolve(item.estado) ? (
                      <>
                        <BookOpenCheck size={16} />
                        Resolver
                      </>
                    ) : (
                      <>
                        <Eye size={16} />
                        Ver
                      </>
                    )}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ApplicantEvaluations;