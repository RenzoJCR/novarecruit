import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { postulacionService } from "../../services/postulacionService.js";
import { logService } from "../../services/logService.js";

function RrhhApplications() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [logs, setLogs] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [reviewComments, setReviewComments] = useState({});

  const [loadingPostulaciones, setLoadingPostulaciones] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const filteredPostulaciones = useMemo(() => {
    const value = search.toLowerCase().trim();

    return postulaciones.filter((postulacion) => {
      const matchesSearch =
        postulacion.postulanteNombre?.toLowerCase().includes(value) ||
        postulacion.postulanteCorreo?.toLowerCase().includes(value) ||
        postulacion.vacanteTitulo?.toLowerCase().includes(value) ||
        postulacion.areaNombre?.toLowerCase().includes(value);

      const matchesStatus =
        selectedStatus === "Todos" || postulacion.estado === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [postulaciones, search, selectedStatus]);

  const pendingCount = postulaciones.filter(
    (postulacion) =>
      postulacion.estado === "POSTULADO" ||
      postulacion.estado === "EN_REVISION_RRHH"
  ).length;

  const approvedCount = postulaciones.filter(
    (postulacion) => postulacion.estado === "APROBADO_RRHH"
  ).length;

  const rejectedCount = postulaciones.filter(
    (postulacion) => postulacion.estado === "RECHAZADO_RRHH"
  ).length;

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

  const loadLogs = async () => {
    try {
      setLoadingLogs(true);
      const data = await logService.getLatest();
      const applicationLogs = data
        .filter((log) => log.modulo === "POSTULACIONES")
        .slice(0, 5);
      setLogs(applicationLogs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const refreshData = async () => {
    await Promise.all([loadPostulaciones(), loadLogs()]);
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

  const handleCommentChange = (postulacionId, value) => {
    setReviewComments((prev) => ({
      ...prev,
      [postulacionId]: value,
    }));
  };

  const handleReview = async (postulacion, approved) => {
    const comentario = reviewComments[postulacion.id] || "";

    if (!comentario.trim()) {
      showMessage("Agrega un comentario de revisión antes de continuar.", "error");
      return;
    }

    try {
      await postulacionService.revisarRrhh(postulacion.id, {
        aprobado: approved,
        comentarioRrhh: comentario.trim(),
      });

      showMessage(
        approved
          ? "Postulación aprobada por RRHH."
          : "Postulación rechazada por RRHH.",
        "success"
      );

      await refreshData();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo revisar la postulación.",
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
    if (status?.includes("APROBADO") || status === "SELECCIONADO") {
      return <CheckCircle2 size={18} />;
    }
    return <Clock size={18} />;
  };

  const canReview = (status) => {
    return status === "POSTULADO" || status === "EN_REVISION_RRHH";
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div>
      <SectionHeader
        title="Postulaciones recibidas"
        description="Revisa postulantes, valida requisitos y decide si pasan a evaluación técnica."
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
          <p className="text-sm text-slate-500 font-semibold">Pendientes</p>
          <p className="text-4xl font-black text-sky-600 mt-2">
            {pendingCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Aprobadas RRHH</p>
          <p className="text-4xl font-black text-emerald-600 mt-2">
            {approvedCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Rechazadas</p>
          <p className="text-4xl font-black text-rose-600 mt-2">
            {rejectedCount}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] p-5 mb-8 grid grid-cols-1 md:grid-cols-[1fr_260px_auto] gap-4 shadow-sm">
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
        </select>

        <button
          onClick={refreshData}
          className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-2xl font-black"
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {loadingPostulaciones ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
          <h2 className="text-2xl font-black text-slate-900">
            Cargando postulaciones...
          </h2>
        </div>
      ) : filteredPostulaciones.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
          <h2 className="text-2xl font-black text-slate-900">
            No hay postulaciones para mostrar
          </h2>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPostulaciones.map((postulacion) => (
            <article
              key={postulacion.id}
              className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    {postulacion.postulanteNombre}
                  </h3>
                  <p className="text-slate-500 mt-1">
                    {postulacion.postulanteCorreo}
                  </p>

                  <p className="text-slate-700 font-bold mt-4">
                    {postulacion.vacanteTitulo}
                  </p>
                  <p className="text-sm text-slate-500">
                    Área: {postulacion.areaNombre} · Postuló:{" "}
                    {formatDateTime(postulacion.fechaPostulacion)}
                  </p>
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

              {canReview(postulacion.estado) && (
                <div className="mt-6 rounded-3xl bg-slate-50 border border-slate-200 p-4">
                  <label className="block text-sm font-black text-slate-700 mb-2">
                    Comentario de revisión
                  </label>

                  <textarea
                    value={reviewComments[postulacion.id] || ""}
                    onChange={(e) =>
                      handleCommentChange(postulacion.id, e.target.value)
                    }
                    placeholder="Ej: Cumple con los requisitos mínimos y puede pasar a evaluación técnica."
                    className="w-full min-h-24 border border-slate-300 rounded-2xl p-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />

                  <div className="flex flex-col md:flex-row gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => handleReview(postulacion, true)}
                      className="inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 px-5 py-3 rounded-2xl font-black"
                    >
                      <UserCheck size={18} />
                      Aprobar para evaluación
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReview(postulacion, false)}
                      className="inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 px-5 py-3 rounded-2xl font-black"
                    >
                      <UserX size={18} />
                      Rechazar
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <section className="mt-8 bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm">
        <h2 className="text-xl font-black text-slate-900">
          Logs recientes de postulaciones
        </h2>

        {loadingLogs ? (
          <p className="text-slate-500 mt-3">Cargando logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-slate-500 mt-3">
            No hay logs recientes de postulaciones.
          </p>
        ) : (
          <div className="space-y-3 mt-5">
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

export default RrhhApplications;