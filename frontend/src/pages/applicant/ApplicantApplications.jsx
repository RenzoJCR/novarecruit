import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  RefreshCw,
  Search,
  X,
  XCircle,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { postulacionService } from "../../services/postulacionService.js";
import { useAuth } from "../../context/AuthContext.jsx";

function getEstadoVisible(estado) {
  const labels = {
    POSTULADO: "Postulado",
    EN_REVISION_RRHH: "En revisión",
    APROBADO_RRHH: "Pasa a evaluación",
    RECHAZADO_RRHH: "No continúa",
    EVALUACION_PENDIENTE: "Evaluación pendiente",
    EVALUACION_COMPLETADA: "Evaluación enviada",
    APROBADO_TECNICO: "Apto para selección",
    RECHAZADO_TECNICO: "No continúa",
    SELECCIONADO: "Seleccionado",
    NO_SELECCIONADO: "No seleccionado",
  };

  return labels[estado] || estado || "Sin estado";
}

function statusClass(estado) {
  const styles = {
    POSTULADO: "bg-sky-50 text-sky-700 border-sky-200",
    EN_REVISION_RRHH: "bg-amber-50 text-amber-700 border-amber-200",
    APROBADO_RRHH: "bg-emerald-50 text-emerald-700 border-emerald-200",
    RECHAZADO_RRHH: "bg-rose-50 text-rose-700 border-rose-200",
    EVALUACION_PENDIENTE: "bg-indigo-50 text-indigo-700 border-indigo-200",
    EVALUACION_COMPLETADA: "bg-violet-50 text-violet-700 border-violet-200",
    APROBADO_TECNICO: "bg-emerald-50 text-emerald-700 border-emerald-200",
    RECHAZADO_TECNICO: "bg-rose-50 text-rose-700 border-rose-200",
    SELECCIONADO: "bg-amber-50 text-amber-700 border-amber-200",
    NO_SELECCIONADO: "bg-slate-50 text-slate-600 border-slate-200",
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

function ApplicantApplications() {
  const { currentUser } = useAuth();

  const [postulaciones, setPostulaciones] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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

      if (selectedApplication) {
        const updated = data.find((item) => item.id === selectedApplication.id);
        setSelectedApplication(updated || null);
      }
    } catch (error) {
      setMessage(error.userMessage || "No se pudieron cargar tus postulaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostulaciones();
  }, [currentUser?.id]);

  const filteredPostulaciones = useMemo(() => {
    const value = search.toLowerCase().trim();

    return postulaciones.filter((postulacion) => {
      const estadoVisible = getEstadoVisible(postulacion.estado).toLowerCase();

      const matchesSearch =
        postulacion.vacanteTitulo?.toLowerCase().includes(value) ||
        postulacion.areaNombre?.toLowerCase().includes(value) ||
        estadoVisible.includes(value);

      const matchesStatus =
        selectedStatus === "Todos" || postulacion.estado === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [postulaciones, search, selectedStatus]);

  const activas = postulaciones.filter((item) =>
    [
      "POSTULADO",
      "EN_REVISION_RRHH",
      "APROBADO_RRHH",
      "EVALUACION_PENDIENTE",
      "EVALUACION_COMPLETADA",
      "APROBADO_TECNICO",
    ].includes(item.estado)
  ).length;

  const finalizadas = postulaciones.filter((item) =>
    ["SELECCIONADO", "NO_SELECCIONADO", "RECHAZADO_RRHH", "RECHAZADO_TECNICO"].includes(
      item.estado
    )
  ).length;

  const seleccionadas = postulaciones.filter(
    (item) => item.estado === "SELECCIONADO"
  ).length;

  return (
    <div>
      <SectionHeader
        title="Mis postulaciones"
        description="Consulta el avance de tus postulaciones y revisa los comentarios del proceso."
      />

      {message && (
        <div className="mb-5 border border-rose-200 bg-rose-50 text-rose-700 rounded-2xl px-4 py-3 text-sm font-semibold">
          {message}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">En proceso</p>
          <p className="text-3xl font-black text-sky-600 mt-1">{activas}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Finalizadas</p>
          <p className="text-3xl font-black text-slate-700 mt-1">
            {finalizadas}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Seleccionadas</p>
          <p className="text-3xl font-black text-amber-600 mt-1">
            {seleccionadas}
          </p>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-[1fr_230px_auto] gap-3">
        <div className="flex items-center gap-3 border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100">
          <Search size={18} className="text-sky-600" />
          <input
            type="text"
            placeholder="Buscar por vacante, área o estado..."
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
          <option value="POSTULADO">Postulado</option>
          <option value="EN_REVISION_RRHH">En revisión</option>
          <option value="APROBADO_RRHH">Pasa a evaluación</option>
          <option value="EVALUACION_PENDIENTE">Evaluación pendiente</option>
          <option value="EVALUACION_COMPLETADA">Evaluación enviada</option>
          <option value="SELECCIONADO">Seleccionado</option>
          <option value="NO_SELECCIONADO">No seleccionado</option>
        </select>

        <button
          type="button"
          onClick={loadPostulaciones}
          className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-black"
        >
          <RefreshCw size={17} />
          Actualizar
        </button>
      </section>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-black text-slate-900">
            Cargando postulaciones...
          </h2>
          <p className="text-slate-500 mt-1">Un momento por favor.</p>
        </div>
      ) : filteredPostulaciones.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-black text-slate-900">
            Aún no tienes postulaciones
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Postula a una vacante para ver su seguimiento aquí.
          </p>
        </div>
      ) : (
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1.4fr_1fr_1fr_170px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase">
            <span>Vacante</span>
            <span>Área</span>
            <span>Estado</span>
            <span className="text-right">Acción</span>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredPostulaciones.map((postulacion) => (
              <div
                key={postulacion.id}
                className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_170px] gap-4 px-5 py-4 items-center"
              >
                <div>
                  <p className="font-black text-slate-900">
                    {postulacion.vacanteTitulo}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 inline-flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDateTime(postulacion.fechaPostulacion)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-700">
                    {postulacion.areaNombre}
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                      postulacion.estado
                    )}`}
                  >
                    {getEstadoVisible(postulacion.estado)}
                  </span>
                </div>

                <div className="flex justify-start lg:justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedApplication(postulacion)}
                    className="inline-flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-sm font-bold"
                  >
                    <Eye size={16} />
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedApplication && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center px-4 py-8">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Detalle de postulación
                </h2>
                <p className="text-sm text-slate-500">
                  {selectedApplication.vacanteTitulo}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="w-9 h-9 rounded-xl border border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">Vacante</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedApplication.vacanteTitulo}
                  </p>
                  <p className="text-sm text-slate-500">
                    {selectedApplication.areaNombre}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">Estado</p>
                  <span
                    className={`inline-flex mt-2 px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                      selectedApplication.estado
                    )}`}
                  >
                    {getEstadoVisible(selectedApplication.estado)}
                  </span>
                </div>
              </section>

              <section>
                <h3 className="font-black text-slate-900 mb-3">
                  Habilidades declaradas
                </h3>

                {selectedApplication.habilidades?.length === 0 ? (
                  <div className="border border-slate-200 rounded-xl p-4 text-slate-500">
                    No hay habilidades registradas.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedApplication.habilidades?.map((item) => (
                      <div
                        key={item.id}
                        className="border border-slate-200 rounded-xl p-4"
                      >
                        <p className="font-black text-slate-900">
                          {item.habilidadNombre}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          Nivel: {item.nivelPostulante}
                        </p>
                        <p className="text-sm text-slate-500">
                          Experiencia: {item.aniosExperiencia || 0} año(s)
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {(selectedApplication.comentarioRrhh ||
                selectedApplication.comentarioTecnico) && (
                <section className="border border-slate-200 rounded-xl p-4">
                  <h3 className="font-black text-slate-900 mb-3">
                    Comentarios del proceso
                  </h3>

                  {selectedApplication.comentarioRrhh && (
                    <p className="text-sm text-slate-600">
                      <strong>RRHH:</strong>{" "}
                      {selectedApplication.comentarioRrhh}
                    </p>
                  )}

                  {selectedApplication.comentarioTecnico && (
                    <p className="text-sm text-slate-600 mt-2">
                      <strong>Evaluación:</strong>{" "}
                      {selectedApplication.comentarioTecnico}
                    </p>
                  )}
                </section>
              )}

              {selectedApplication.estado === "SELECCIONADO" && (
                <section className="border border-amber-200 bg-amber-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className="text-amber-700 shrink-0 mt-1"
                    />
                    <p className="text-sm text-slate-700">
                      Has sido seleccionado para esta vacante. RRHH continuará
                      con la comunicación del proceso.
                    </p>
                  </div>
                </section>
              )}

              {(selectedApplication.estado === "RECHAZADO_RRHH" ||
                selectedApplication.estado === "RECHAZADO_TECNICO" ||
                selectedApplication.estado === "NO_SELECCIONADO") && (
                <section className="border border-slate-200 bg-slate-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <XCircle
                      size={20}
                      className="text-slate-500 shrink-0 mt-1"
                    />
                    <p className="text-sm text-slate-600">
                      Esta postulación ya no continúa en el proceso.
                    </p>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicantApplications;