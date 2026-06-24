import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  RefreshCw,
  Search,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { postulacionService } from "../../services/postulacionService.js";
import {
  formatDateTime,
  getNivelLabel,
  getPostulacionEstadoLabel,
  statusClass,
} from "../../utils/statusLabels.js";

function canReview(estado) {
  return ["POSTULADO", "EN_REVISION_RRHH"].includes(estado);
}

function RrhhApplications() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [reviewForms, setReviewForms] = useState({});

  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const loadPostulaciones = async () => {
    try {
      setLoading(true);

      const data = await postulacionService.getAll();
      setPostulaciones(data);

      const initialForms = {};
      data.forEach((item) => {
        initialForms[item.id] = {
          comentarioRrhh: item.comentarioRrhh || "",
        };
      });

      setReviewForms(initialForms);

      if (selectedApplication) {
        const updatedSelected = data.find(
          (item) => item.id === selectedApplication.id
        );
        setSelectedApplication(updatedSelected || null);
      }
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudieron cargar las postulaciones.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostulaciones();
  }, []);

  const filteredPostulaciones = useMemo(() => {
    const value = search.toLowerCase().trim();

    return postulaciones.filter((item) => {
      const estadoVisible = getPostulacionEstadoLabel(
        item.estado
      ).toLowerCase();

      const matchesSearch =
        item.postulanteNombre?.toLowerCase().includes(value) ||
        item.postulanteCorreo?.toLowerCase().includes(value) ||
        item.vacanteTitulo?.toLowerCase().includes(value) ||
        item.areaNombre?.toLowerCase().includes(value) ||
        estadoVisible.includes(value);

      const matchesStatus =
        selectedStatus === "Todos" || item.estado === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [postulaciones, search, selectedStatus]);

  const pendientes = postulaciones.filter((item) =>
    ["POSTULADO", "EN_REVISION_RRHH"].includes(item.estado)
  ).length;

  const listasEvaluacion = postulaciones.filter(
    (item) => item.estado === "APROBADO_RRHH"
  ).length;

  const noContinuan = postulaciones.filter((item) =>
    ["RECHAZADO_RRHH", "RECHAZADO_TECNICO", "NO_SELECCIONADO"].includes(
      item.estado
    )
  ).length;

  const handleReviewFormChange = (id, value) => {
    setReviewForms((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        comentarioRrhh: value,
      },
    }));
  };

  const validateReview = (item) => {
    const form = reviewForms[item.id] || {};

    if (!form.comentarioRrhh?.trim()) {
      return "Agrega un comentario breve para sustentar la decisión.";
    }

    if (form.comentarioRrhh.trim().length < 5) {
      return "El comentario debe tener al menos 5 caracteres.";
    }

    return null;
  };

  const handleReview = async (item, approved) => {
    const validationError = validateReview(item);

    if (validationError) {
      showMessage(validationError, "error");
      return;
    }

    const form = reviewForms[item.id];

    try {
      setReviewingId(item.id);

      await postulacionService.reviewRrhh(item.id, {
        aprobado: approved,
        comentarioRrhh: form.comentarioRrhh.trim(),
      });

      showMessage(
        approved
          ? "Postulación aprobada para evaluación técnica."
          : "Postulación rechazada correctamente.",
        "success"
      );

      await loadPostulaciones();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo registrar la revisión.",
        "error"
      );
    } finally {
      setReviewingId(null);
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
        title="Postulaciones"
        description="Revisa candidatos y decide quiénes pasan a evaluación técnica."
      />

      {message && (
        <div
          className={`mb-5 border rounded-2xl px-4 py-3 text-sm font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Pendientes</p>
          <p className="text-3xl font-black text-amber-600 mt-1">
            {pendientes}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">
            Listas para evaluación
          </p>
          <p className="text-3xl font-black text-emerald-600 mt-1">
            {listasEvaluacion}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">No continúan</p>
          <p className="text-3xl font-black text-rose-600 mt-1">
            {noContinuan}
          </p>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-[1fr_230px_auto] gap-3">
        <div className="flex items-center gap-3 border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100">
          <Search size={18} className="text-amber-600" />

          <input
            type="text"
            placeholder="Buscar candidato, correo, vacante o área..."
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
          <option value="POSTULADO">Pendientes</option>
          <option value="EN_REVISION_RRHH">En revisión</option>
          <option value="APROBADO_RRHH">Listos para evaluación</option>
          <option value="RECHAZADO_RRHH">No continúan</option>
          <option value="EVALUACION_PENDIENTE">Evaluación asignada</option>
          <option value="EVALUACION_COMPLETADA">Por revisar</option>
          <option value="SELECCIONADO">Seleccionados</option>
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
        </div>
      ) : filteredPostulaciones.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-black text-slate-900">
            No hay postulaciones para mostrar
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Ajusta los filtros o espera nuevas postulaciones.
          </p>
        </div>
      ) : (
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1.4fr_1.3fr_1fr_1fr_120px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase">
            <span>Candidato</span>
            <span>Vacante</span>
            <span>Área</span>
            <span>Estado</span>
            <span className="text-right">Acción</span>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredPostulaciones.map((postulacion) => (
              <div
                key={postulacion.id}
                className="grid grid-cols-1 lg:grid-cols-[1.4fr_1.3fr_1fr_1fr_120px] gap-4 px-5 py-4 items-center"
              >
                <div>
                  <p className="font-black text-slate-900">
                    {postulacion.postulanteNombre}
                  </p>
                  <p className="text-sm text-slate-500">
                    {postulacion.postulanteCorreo}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {formatDateTime(postulacion.fechaPostulacion)}
                  </p>
                </div>

                <p className="font-bold text-slate-800">
                  {postulacion.vacanteTitulo}
                </p>

                <p className="text-sm text-slate-600">
                  {postulacion.areaNombre}
                </p>

                <div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                      postulacion.estado
                    )}`}
                  >
                    {getPostulacionEstadoLabel(postulacion.estado)}
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
                  {selectedApplication.postulanteNombre} ·{" "}
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
                  <p className="text-xs font-black text-slate-500">Candidato</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedApplication.postulanteNombre}
                  </p>
                  <p className="text-sm text-slate-500">
                    {selectedApplication.postulanteCorreo}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">Vacante</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedApplication.vacanteTitulo}
                  </p>
                  <p className="text-sm text-slate-500">
                    {selectedApplication.areaNombre}
                  </p>
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
                          Nivel: {getNivelLabel(item.nivelPostulante)}
                        </p>
                        <p className="text-sm text-slate-500">
                          Experiencia: {item.aniosExperiencia || 0} año(s)
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="border border-slate-200 rounded-xl p-4">
                <h3 className="font-black text-slate-900 mb-3">
                  Revisión de RRHH
                </h3>

                <span
                  className={`inline-flex mb-4 px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                    selectedApplication.estado
                  )}`}
                >
                  {getPostulacionEstadoLabel(selectedApplication.estado)}
                </span>

                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Comentario
                </label>

                <textarea
                  value={
                    reviewForms[selectedApplication.id]?.comentarioRrhh || ""
                  }
                  onChange={(e) =>
                    handleReviewFormChange(
                      selectedApplication.id,
                      e.target.value
                    )
                  }
                  disabled={!canReview(selectedApplication.estado)}
                  placeholder="Ej: Cumple con los requisitos básicos para pasar a evaluación técnica."
                  className="w-full min-h-24 border border-slate-300 rounded-xl p-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:bg-slate-100 disabled:text-slate-500"
                />

                {selectedApplication.comentarioRrhh &&
                  !canReview(selectedApplication.estado) && (
                    <p className="text-sm text-slate-500 mt-3">
                      Comentario registrado:{" "}
                      <strong>{selectedApplication.comentarioRrhh}</strong>
                    </p>
                  )}

                {canReview(selectedApplication.estado) ? (
                  <div className="flex flex-col md:flex-row gap-2 mt-4">
                    <button
                      type="button"
                      disabled={reviewingId === selectedApplication.id}
                      onClick={() => handleReview(selectedApplication, true)}
                      className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl text-sm font-black"
                    >
                      <UserCheck size={17} />
                      Aprobar para evaluación
                    </button>

                    <button
                      type="button"
                      disabled={reviewingId === selectedApplication.id}
                      onClick={() => handleReview(selectedApplication, false)}
                      className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl text-sm font-black"
                    >
                      <UserX size={17} />
                      Rechazar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 mt-4 border border-slate-200 bg-slate-50 rounded-xl p-4">
                    <CheckCircle2
                      size={20}
                      className="text-slate-500 shrink-0 mt-1"
                    />

                    <p className="text-sm text-slate-600">
                      Esta postulación ya fue revisada o avanzó a otra etapa.
                    </p>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RrhhApplications;