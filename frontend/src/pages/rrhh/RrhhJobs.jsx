import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Eye,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  Users,
  UserX,
  X,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { vacanteService } from "../../services/vacanteService.js";
import { postulacionService } from "../../services/postulacionService.js";
import {
  formatDate,
  formatDateTime,
  formatMoney,
  getModalidadLabel,
  getNivelLabel,
  getPostulacionEstadoLabel,
  getVacanteEstadoLabel,
  statusClass,
} from "../../utils/statusLabels.js";

function canReviewPostulacion(estado) {
  return ["POSTULADO", "EN_REVISION_RRHH"].includes(estado);
}

function RrhhJobs() {
  const [vacantes, setVacantes] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);

  const [selectedVacante, setSelectedVacante] = useState(null);
  const [expandedPostulacionId, setExpandedPostulacionId] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [reviewForms, setReviewForms] = useState({});

  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);
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

  const loadData = async () => {
    try {
      setLoading(true);

      const [vacantesData, postulacionesData] = await Promise.all([
        vacanteService.getAll(),
        postulacionService.getAll(),
      ]);

      setVacantes(vacantesData);
      setPostulaciones(postulacionesData);

      const initialForms = {};
      postulacionesData.forEach((item) => {
        initialForms[item.id] = {
          comentarioRrhh: item.comentarioRrhh || "",
        };
      });

      setReviewForms(initialForms);

      if (selectedVacante) {
        const updatedVacante = vacantesData.find(
          (item) => Number(item.id) === Number(selectedVacante.id)
        );

        setSelectedVacante(updatedVacante || null);
      }
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudieron cargar las vacantes.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getPostulacionesByVacante = (vacanteId) => {
    return postulaciones.filter(
      (item) => Number(item.vacanteId) === Number(vacanteId)
    );
  };

  const getStatsByVacante = (vacanteId) => {
    const candidates = getPostulacionesByVacante(vacanteId);

    return {
      total: candidates.length,
      pendientes: candidates.filter((item) =>
        ["POSTULADO", "EN_REVISION_RRHH"].includes(item.estado)
      ).length,
      aprobados: candidates.filter((item) =>
        [
          "APROBADO_RRHH",
          "EVALUACION_PENDIENTE",
          "EVALUACION_COMPLETADA",
          "APROBADO_TECNICO",
          "SELECCIONADO",
        ].includes(item.estado)
      ).length,
      rechazados: candidates.filter((item) =>
        ["RECHAZADO_RRHH", "RECHAZADO_TECNICO", "NO_SELECCIONADO"].includes(
          item.estado
        )
      ).length,
      seleccionados: candidates.filter((item) => item.estado === "SELECCIONADO")
        .length,
    };
  };

  const filteredVacantes = useMemo(() => {
    const value = search.toLowerCase().trim();

    return vacantes.filter((vacante) => {
      const estadoVisible = getVacanteEstadoLabel(vacante.estado).toLowerCase();
      const stats = getStatsByVacante(vacante.id);

      const matchesSearch =
        vacante.titulo?.toLowerCase().includes(value) ||
        vacante.areaNombre?.toLowerCase().includes(value) ||
        vacante.modalidad?.toLowerCase().includes(value) ||
        vacante.ubicacion?.toLowerCase().includes(value) ||
        estadoVisible.includes(value);

      const matchesStatus =
        selectedStatus === "Todos" || vacante.estado === selectedStatus;

      return matchesSearch && matchesStatus && stats.total >= 0;
    });
  }, [vacantes, postulaciones, search, selectedStatus]);

  const activas = vacantes.filter((item) => item.estado === "ACTIVA").length;
  const enProceso = vacantes.filter(
    (item) => item.estado === "EN_PROCESO"
  ).length;
  const totalPostulaciones = postulaciones.length;

  const openVacante = (vacante) => {
    setSelectedVacante(vacante);
    setExpandedPostulacionId(null);
  };

  const closeVacante = () => {
    setSelectedVacante(null);
    setExpandedPostulacionId(null);
  };

  const canCancel = (vacante) => {
    return vacante.estado !== "CERRADA" && vacante.estado !== "CANCELADA";
  };

  const handleCancel = async (vacante) => {
    const confirmed = window.confirm(
      `¿Deseas cancelar la vacante "${vacante.titulo}"?`
    );

    if (!confirmed) return;

    try {
      setCancelingId(vacante.id);

      await vacanteService.cancel(vacante.id);

      showMessage("Vacante cancelada correctamente.", "success");
      await loadData();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo cancelar la vacante.",
        "error"
      );
    } finally {
      setCancelingId(null);
    }
  };

  const handleReviewFormChange = (id, value) => {
    setReviewForms((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        comentarioRrhh: value,
      },
    }));
  };

  const validateReview = (postulacion) => {
    const form = reviewForms[postulacion.id] || {};

    if (!form.comentarioRrhh?.trim()) {
      return "Agrega un comentario breve para sustentar la decisión.";
    }

    if (form.comentarioRrhh.trim().length < 5) {
      return "El comentario debe tener al menos 5 caracteres.";
    }

    return null;
  };

  const handleReview = async (postulacion, approved) => {
    const validationError = validateReview(postulacion);

    if (validationError) {
      showMessage(validationError, "error");
      return;
    }

    const form = reviewForms[postulacion.id];

    try {
      setReviewingId(postulacion.id);

      await postulacionService.reviewRrhh(postulacion.id, {
        aprobado: approved,
        comentarioRrhh: form.comentarioRrhh.trim(),
      });

      showMessage(
        approved
          ? "Postulación aprobada para evaluación técnica."
          : "Postulación rechazada correctamente.",
        "success"
      );

      await loadData();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo registrar la revisión.",
        "error"
      );
    } finally {
      setReviewingId(null);
    }
  };

  const selectedCandidates = selectedVacante
    ? getPostulacionesByVacante(selectedVacante.id)
    : [];

  const selectedStats = selectedVacante
    ? getStatsByVacante(selectedVacante.id)
    : null;

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div>
      <SectionHeader
        title="Vacantes"
        description="Gestiona vacantes y revisa sus candidatos desde un solo lugar."
        action={
          <Link
            to="/rrhh/vacantes/create"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-sm font-black"
          >
            <Plus size={17} />
            Nueva vacante
          </Link>
        }
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
          <p className="text-sm text-slate-500 font-semibold">Vacantes activas</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">
            {activas}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">En proceso</p>
          <p className="text-3xl font-black text-amber-600 mt-1">
            {enProceso}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">
            Postulaciones totales
          </p>
          <p className="text-3xl font-black text-sky-600 mt-1">
            {totalPostulaciones}
          </p>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3">
        <div className="flex items-center gap-3 border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100">
          <Search size={18} className="text-amber-600" />

          <input
            type="text"
            placeholder="Buscar por título, área, modalidad o ubicación..."
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
          <option value="ACTIVA">Activas</option>
          <option value="EN_PROCESO">En proceso</option>
          <option value="CERRADA">Cerradas</option>
          <option value="CANCELADA">Canceladas</option>
        </select>

        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-black"
        >
          <RefreshCw size={17} />
          Actualizar
        </button>
      </section>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-black text-slate-900">
            Cargando vacantes...
          </h2>
        </div>
      ) : filteredVacantes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <Briefcase size={36} className="mx-auto text-amber-600" />

          <h2 className="text-xl font-black text-slate-900 mt-3">
            No hay vacantes para mostrar
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Crea una nueva vacante o ajusta los filtros.
          </p>
        </div>
      ) : (
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1.5fr_1fr_0.9fr_0.9fr_0.8fr_180px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase">
            <span>Vacante</span>
            <span>Área</span>
            <span>Candidatos</span>
            <span>Cierre</span>
            <span>Estado</span>
            <span className="text-right">Acciones</span>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredVacantes.map((vacante) => {
              const stats = getStatsByVacante(vacante.id);

              return (
                <div
                  key={vacante.id}
                  className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_0.9fr_0.9fr_0.8fr_180px] gap-4 px-5 py-4 items-center"
                >
                  <div>
                    <p className="font-black text-slate-900">{vacante.titulo}</p>

                    <div className="flex flex-wrap gap-3 text-sm text-slate-500 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={14} />
                        {getModalidadLabel(vacante.modalidad)}
                      </span>

                      <span>{vacante.ubicacion || "Sin ubicación"}</span>
                    </div>

                    {stats.seleccionados > 0 && (
                      <p className="text-xs text-amber-700 font-black mt-1">
                        Ganador seleccionado
                      </p>
                    )}
                  </div>

                  <p className="text-sm font-bold text-slate-800">
                    {vacante.areaNombre}
                  </p>

                  <div className="text-sm text-slate-600">
                    <p className="font-black text-slate-900">
                      {stats.total} candidato(s)
                    </p>
                    <p className="text-xs text-slate-500">
                      {stats.pendientes} pendiente(s)
                    </p>
                  </div>

                  <p className="inline-flex items-center gap-1 text-sm text-slate-600">
                    <Calendar size={15} />
                    {formatDate(vacante.fechaCierre)}
                  </p>

                  <div>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                        vacante.estado
                      )}`}
                    >
                      {getVacanteEstadoLabel(vacante.estado)}
                    </span>
                  </div>

                  <div className="flex justify-start lg:justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openVacante(vacante)}
                      className="inline-flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-sm font-bold"
                    >
                      <Eye size={16} />
                      Ver
                    </button>

                    {canCancel(vacante) && (
                      <button
                        type="button"
                        disabled={cancelingId === vacante.id}
                        onClick={() => handleCancel(vacante)}
                        className="inline-flex items-center gap-1.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 disabled:bg-slate-100 text-rose-700 disabled:text-slate-500 px-3 py-2 rounded-xl text-sm font-bold"
                      >
                        <Trash2 size={16} />
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {selectedVacante && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center px-4 py-8">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-start justify-between gap-4 z-10">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Vacante y candidatos
                </h2>
                <p className="text-sm text-slate-500">
                  {selectedVacante.titulo} · {selectedVacante.areaNombre}
                </p>
              </div>

              <button
                type="button"
                onClick={closeVacante}
                className="w-9 h-9 rounded-xl border border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <section className="border border-slate-200 rounded-xl p-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <span className="inline-flex px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-black mb-3">
                      {selectedVacante.areaNombre}
                    </span>

                    <h3 className="text-2xl font-black text-slate-900">
                      {selectedVacante.titulo}
                    </h3>

                    <p className="text-sm text-slate-500 mt-2">
                      {selectedVacante.descripcion}
                    </p>
                  </div>

                  <span
                    className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                      selectedVacante.estado
                    )}`}
                  >
                    {getVacanteEstadoLabel(selectedVacante.estado)}
                  </span>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">Modalidad</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {getModalidadLabel(selectedVacante.modalidad)}
                  </p>
                  <p className="text-sm text-slate-500">
                    {selectedVacante.ubicacion || "Sin ubicación"}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">Salario</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {formatMoney(selectedVacante.salario)}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">
                    Experiencia
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {getNivelLabel(selectedVacante.nivelExperiencia)}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">
                    Fecha de cierre
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {formatDate(selectedVacante.fechaCierre)}
                  </p>
                </div>
              </section>

              <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <Users size={18} className="text-slate-600" />
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {selectedStats.total}
                  </p>
                  <p className="text-xs text-slate-500">Candidatos</p>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <Eye size={18} className="text-amber-700" />
                  <p className="text-2xl font-black text-amber-700 mt-1">
                    {selectedStats.pendientes}
                  </p>
                  <p className="text-xs text-amber-700">Pendientes</p>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <UserCheck size={18} className="text-emerald-700" />
                  <p className="text-2xl font-black text-emerald-700 mt-1">
                    {selectedStats.aprobados}
                  </p>
                  <p className="text-xs text-emerald-700">Aprobados</p>
                </div>

                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                  <UserX size={18} className="text-rose-700" />
                  <p className="text-2xl font-black text-rose-700 mt-1">
                    {selectedStats.rechazados}
                  </p>
                  <p className="text-xs text-rose-700">No continúan</p>
                </div>
              </section>

              <section>
                <h3 className="font-black text-slate-900 mb-3">
                  Habilidades requeridas
                </h3>

                {selectedVacante.habilidades?.length === 0 ||
                !selectedVacante.habilidades ? (
                  <div className="border border-slate-200 rounded-xl p-4 text-slate-500">
                    No hay habilidades registradas.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {selectedVacante.habilidades?.map((item) => (
                      <div
                        key={item.id || item.habilidadId}
                        className="border border-slate-200 rounded-xl p-4"
                      >
                        <p className="font-black text-slate-900">
                          {item.habilidadNombre}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          Nivel requerido: {getNivelLabel(item.nivelRequerido)}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.obligatorio ? "Obligatoria" : "Deseable"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h3 className="font-black text-slate-900 mb-3">
                  Candidatos postulados
                </h3>

                {selectedCandidates.length === 0 ? (
                  <div className="border border-slate-200 rounded-xl p-6 text-center">
                    <Users size={32} className="mx-auto text-amber-600" />
                    <p className="font-black text-slate-900 mt-3">
                      No hay candidatos postulados
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Cuando un postulante aplique, aparecerá en esta sección.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedCandidates.map((postulacion) => {
                      const expanded =
                        expandedPostulacionId === postulacion.id;
                      const canReview =
                        canReviewPostulacion(postulacion.estado);

                      return (
                        <div
                          key={postulacion.id}
                          className="border border-slate-200 rounded-xl p-4"
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_180px] gap-4 items-start">
                            <div>
                              <p className="font-black text-slate-900">
                                {postulacion.postulanteNombre}
                              </p>

                              <p className="text-sm text-slate-500">
                                {postulacion.postulanteCorreo}
                              </p>

                              <p className="text-xs text-slate-400 mt-1">
                                Postuló:{" "}
                                {formatDateTime(
                                  postulacion.fechaPostulacion
                                )}
                              </p>
                            </div>

                            <div>
                              <span
                                className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                                  postulacion.estado
                                )}`}
                              >
                                {getPostulacionEstadoLabel(
                                  postulacion.estado
                                )}
                              </span>

                              {postulacion.comentarioRrhh && (
                                <p className="text-xs text-slate-500 mt-2">
                                  Comentario RRHH:{" "}
                                  <strong>
                                    {postulacion.comentarioRrhh}
                                  </strong>
                                </p>
                              )}
                            </div>

                            <div className="flex lg:justify-end">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedPostulacionId(
                                    expanded ? null : postulacion.id
                                  )
                                }
                                className="inline-flex items-center justify-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-sm font-bold"
                              >
                                <Eye size={16} />
                                {expanded ? "Ocultar" : "Ver"}
                              </button>
                            </div>
                          </div>

                          {expanded && (
                            <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                              <div>
                                <h4 className="font-black text-slate-900 mb-3">
                                  Habilidades declaradas
                                </h4>

                                {postulacion.habilidades?.length === 0 ||
                                !postulacion.habilidades ? (
                                  <div className="border border-slate-200 rounded-xl p-4 text-slate-500">
                                    No hay habilidades declaradas.
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                    {postulacion.habilidades?.map((item) => (
                                      <div
                                        key={item.id}
                                        className="border border-slate-200 rounded-xl p-4"
                                      >
                                        <p className="font-black text-slate-900">
                                          {item.habilidadNombre}
                                        </p>
                                        <p className="text-sm text-slate-500 mt-1">
                                          Nivel:{" "}
                                          {getNivelLabel(
                                            item.nivelPostulante
                                          )}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                          Experiencia:{" "}
                                          {item.aniosExperiencia || 0} año(s)
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="border border-slate-200 rounded-xl p-4">
                                <h4 className="font-black text-slate-900 mb-3">
                                  Revisión de RRHH
                                </h4>

                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                  Comentario
                                </label>

                                <textarea
                                  value={
                                    reviewForms[postulacion.id]
                                      ?.comentarioRrhh || ""
                                  }
                                  onChange={(e) =>
                                    handleReviewFormChange(
                                      postulacion.id,
                                      e.target.value
                                    )
                                  }
                                  disabled={!canReview}
                                  placeholder="Ej: Cumple con los requisitos básicos para pasar a evaluación técnica."
                                  className="w-full min-h-24 border border-slate-300 rounded-xl p-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:bg-slate-100 disabled:text-slate-500"
                                />

                                {canReview ? (
                                  <div className="flex flex-col md:flex-row gap-2 mt-4">
                                    <button
                                      type="button"
                                      disabled={reviewingId === postulacion.id}
                                      onClick={() =>
                                        handleReview(postulacion, true)
                                      }
                                      className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl text-sm font-black"
                                    >
                                      <UserCheck size={17} />
                                      Aprobar para evaluación
                                    </button>

                                    <button
                                      type="button"
                                      disabled={reviewingId === postulacion.id}
                                      onClick={() =>
                                        handleReview(postulacion, false)
                                      }
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
                                      Esta postulación ya fue revisada o avanzó
                                      a otra etapa del proceso.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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

export default RrhhJobs;