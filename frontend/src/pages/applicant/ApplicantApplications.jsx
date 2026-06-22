import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { postulacionService } from "../../services/postulacionService.js";
import { useAuth } from "../../context/AuthContext.jsx";

function ApplicantApplications() {
  const { currentUser } = useAuth();

  const [postulaciones, setPostulaciones] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const filteredPostulaciones = useMemo(() => {
    const value = search.toLowerCase().trim();

    return postulaciones.filter((postulacion) => {
      const matchesSearch =
        postulacion.vacanteTitulo?.toLowerCase().includes(value) ||
        postulacion.areaNombre?.toLowerCase().includes(value);

      const matchesStatus =
        selectedStatus === "Todos" || postulacion.estado === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [postulaciones, search, selectedStatus]);

  const loadPostulaciones = async () => {
    if (!currentUser?.id) {
      setMessage("No se encontró el usuario autenticado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await postulacionService.getByUsuario(currentUser.id);
      setPostulaciones(data);
    } catch (error) {
      setMessage(error.userMessage || "No se pudieron cargar tus postulaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostulaciones();
  }, [currentUser?.id]);

  const formatDateTime = (value) => {
    if (!value) return "Sin fecha";

    return new Date(value).toLocaleString("es-PE", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const statusClass = (status) => {
    const styles = {
      POSTULADO: "bg-sky-50 text-sky-700 border-sky-200",
      EN_REVISION_RRHH: "bg-amber-50 text-amber-700 border-amber-200",
      APROBADO_RRHH: "bg-emerald-50 text-emerald-700 border-emerald-200",
      RECHAZADO_RRHH: "bg-rose-50 text-rose-700 border-rose-200",
      EVALUACION_PENDIENTE: "bg-indigo-50 text-indigo-700 border-indigo-200",
      EVALUACION_COMPLETADA: "bg-violet-50 text-violet-700 border-violet-200",
      APROBADO_TECNICO: "bg-emerald-50 text-emerald-700 border-emerald-200",
      RECHAZADO_TECNICO: "bg-rose-50 text-rose-700 border-rose-200",
      SELECCIONADO: "bg-emerald-100 text-emerald-800 border-emerald-300",
      NO_SELECCIONADO: "bg-slate-50 text-slate-600 border-slate-200",
    };

    return styles[status] || "bg-slate-50 text-slate-600 border-slate-200";
  };

  const statusIcon = (status) => {
    if (status?.includes("RECHAZADO")) return <XCircle size={18} />;

    if (status === "SELECCIONADO" || status?.includes("APROBADO")) {
      return <CheckCircle2 size={18} />;
    }

    return <Clock size={18} />;
  };

  return (
    <div>
      <SectionHeader
        title="Mis postulaciones"
        description={`Consulta el estado real de tus postulaciones, ${
          currentUser?.nombreCompleto || "postulante"
        }.`}
      />

      {message && (
        <div className="mb-5 border border-rose-200 bg-rose-50 text-rose-700 rounded-3xl px-5 py-4 font-semibold">
          {message}
        </div>
      )}

      <div className="bg-white/95 border border-slate-200 rounded-[2rem] p-5 mb-8 grid grid-cols-1 md:grid-cols-[1fr_260px_auto] gap-4 shadow-sm">
        <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
          <Search size={18} className="text-emerald-600" />
          <input
            type="text"
            placeholder="Buscar por vacante o área..."
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
          <option value="POSTULADO">Postulado</option>
          <option value="APROBADO_RRHH">Aprobado RRHH</option>
          <option value="RECHAZADO_RRHH">Rechazado RRHH</option>
          <option value="EVALUACION_PENDIENTE">Evaluación pendiente</option>
          <option value="EVALUACION_COMPLETADA">Evaluación completada</option>
          <option value="APROBADO_TECNICO">Aprobado técnico</option>
          <option value="RECHAZADO_TECNICO">Rechazado técnico</option>
          <option value="SELECCIONADO">Seleccionado</option>
          <option value="NO_SELECCIONADO">No seleccionado</option>
        </select>

        <button
          type="button"
          onClick={loadPostulaciones}
          className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-2xl font-black"
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
          <h2 className="text-2xl font-black text-slate-900">
            Cargando postulaciones...
          </h2>
        </div>
      ) : filteredPostulaciones.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
          <h2 className="text-2xl font-black text-slate-900">
            Aún no tienes postulaciones
          </h2>
          <p className="text-slate-500 mt-2">
            Postula a una vacante para ver su seguimiento aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredPostulaciones.map((postulacion) => (
            <article
              key={postulacion.id}
              className="bg-white/95 border border-slate-200 rounded-[2rem] p-6 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div>
                  <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black mb-3">
                    {postulacion.areaNombre}
                  </span>

                  <h3 className="text-2xl font-black text-slate-900">
                    {postulacion.vacanteTitulo}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-3">
                    <Calendar size={17} className="text-emerald-600" />
                    Postulación enviada:{" "}
                    {formatDateTime(postulacion.fechaPostulacion)}
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-black ${statusClass(
                    postulacion.estado
                  )}`}
                >
                  {statusIcon(postulacion.estado)}
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

              {(postulacion.comentarioRrhh || postulacion.comentarioTecnico) && (
                <div className="mt-6 rounded-3xl bg-slate-50 border border-slate-200 p-4">
                  <p className="font-black text-slate-900 mb-2">
                    Comentarios del proceso
                  </p>

                  {postulacion.comentarioRrhh && (
                    <p className="text-sm text-slate-600">
                      <strong>RRHH:</strong> {postulacion.comentarioRrhh}
                    </p>
                  )}

                  {postulacion.comentarioTecnico && (
                    <p className="text-sm text-slate-600 mt-2">
                      <strong>Técnico:</strong> {postulacion.comentarioTecnico}
                    </p>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApplicantApplications;