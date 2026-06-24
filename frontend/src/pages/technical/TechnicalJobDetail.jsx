import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BookOpenCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  Eye,
  RefreshCw,
  Search,
  Send,
  Star,
  Trophy,
  UserCheck,
  UserX,
  Users,
  X,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { vacanteService } from "../../services/vacanteService.js";
import { postulacionService } from "../../services/postulacionService.js";
import { evaluacionService } from "../../services/evaluacionService.js";
import { evaluacionPostulacionService } from "../../services/evaluacionPostulacionService.js";
import {
  formatDateTime,
  getEvaluacionEstadoLabel,
  getEvaluacionPostulacionEstadoLabel,
  getPostulacionEstadoLabel,
  getVacanteEstadoLabel,
  statusClass,
} from "../../utils/statusLabels.js";

function TechnicalJobDetail() {
  const { id } = useParams();

  const [vacante, setVacante] = useState(null);
  const [postulaciones, setPostulaciones] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  const [selectedEvaluations, setSelectedEvaluations] = useState({});
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [reviewForms, setReviewForms] = useState({});

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  const [reviewingId, setReviewingId] = useState(null);
  const [selectingWinnerId, setSelectingWinnerId] = useState(null);

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

      const [
        vacanteData,
        postulacionesData,
        evaluacionesData,
        asignacionesData,
      ] = await Promise.all([
        vacanteService.getById(id),
        postulacionService.getByVacante(id),
        evaluacionService.getByVacante(id),
        evaluacionPostulacionService.getAll(),
      ]);

      const asignacionesVacante = asignacionesData.filter(
        (item) => Number(item.vacanteId) === Number(id)
      );

      setVacante(vacanteData);
      setPostulaciones(postulacionesData);
      setEvaluaciones(evaluacionesData);
      setAsignaciones(asignacionesVacante);

      const initialForms = {};
      asignacionesVacante.forEach((item) => {
        initialForms[item.id] = {
          puntajeObtenido: item.puntajeObtenido ?? "",
          comentarioTecnico: item.comentarioTecnico || "",
        };
      });

      setReviewForms(initialForms);
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo cargar el proceso técnico.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const evaluacionesActivas = useMemo(() => {
    return evaluaciones.filter((item) => item.estado === "ACTIVA");
  }, [evaluaciones]);

  const candidatosFiltrados = useMemo(() => {
    const value = search.toLowerCase().trim();

    return postulaciones.filter((postulacion) => {
      const estadoVisible = getPostulacionEstadoLabel(
        postulacion.estado
      ).toLowerCase();

      const matchesSearch =
        postulacion.postulanteNombre?.toLowerCase().includes(value) ||
        postulacion.postulanteCorreo?.toLowerCase().includes(value) ||
        estadoVisible.includes(value);

      const matchesStatus =
        selectedStatus === "Todos" || postulacion.estado === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [postulaciones, search, selectedStatus]);

  const stats = useMemo(() => {
    return {
      total: postulaciones.length,
      listos: postulaciones.filter((item) => item.estado === "APROBADO_RRHH")
        .length,
      enEvaluacion: postulaciones.filter((item) =>
        ["EVALUACION_PENDIENTE", "EVALUACION_COMPLETADA"].includes(item.estado)
      ).length,
      porRevisar: asignaciones.filter((item) => item.estado === "COMPLETADA")
        .length,
      aptos: postulaciones.filter((item) => item.estado === "APROBADO_TECNICO")
        .length,
      seleccionado: postulaciones.filter(
        (item) => item.estado === "SELECCIONADO"
      ).length,
    };
  }, [postulaciones, asignaciones]);

  const getAsignacionByPostulacion = (postulacionId) => {
    return asignaciones.find(
      (item) => Number(item.postulacionId) === Number(postulacionId)
    );
  };

  const handleSelectEvaluation = (postulacionId, evaluacionId) => {
    setSelectedEvaluations((prev) => ({
      ...prev,
      [postulacionId]: evaluacionId,
    }));
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

      await loadData();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo asignar la evaluación.",
        "error"
      );
    } finally {
      setAssigningId(null);
    }
  };

  const openReviewModal = (asignacion, postulacion) => {
    setSelectedAssignment({
      ...asignacion,
      postulacion,
    });
  };

  const handleReviewFormChange = (id, field, value) => {
    if (field === "puntajeObtenido") {
      const validNumber = value === "" || /^\d*\.?\d{0,2}$/.test(value);

      if (!validNumber) return;
    }

    setReviewForms((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const validateReview = (asignacion) => {
    const form = reviewForms[asignacion.id] || {};
    const puntaje = Number(form.puntajeObtenido);

    if (form.puntajeObtenido === "" || form.puntajeObtenido === null) {
      return "Ingresa el puntaje final.";
    }

    if (Number.isNaN(puntaje)) {
      return "El puntaje debe ser un número válido.";
    }

    if (puntaje < 0) {
      return "El puntaje no puede ser negativo.";
    }

    if (!form.comentarioTecnico?.trim()) {
      return "Agrega un comentario técnico breve.";
    }

    if (form.comentarioTecnico.trim().length < 5) {
      return "El comentario debe tener al menos 5 caracteres.";
    }

    return null;
  };

  const handleTechnicalReview = async (asignacion, approved) => {
    const validationError = validateReview(asignacion);

    if (validationError) {
      showMessage(validationError, "error");
      return;
    }

    const form = reviewForms[asignacion.id];

    try {
      setReviewingId(asignacion.id);

      await evaluacionPostulacionService.review(asignacion.id, {
        aprobado: approved,
        puntajeObtenido: Number(form.puntajeObtenido),
        comentarioTecnico: form.comentarioTecnico.trim(),
      });

      showMessage(
        approved
          ? "Postulante aprobado técnicamente."
          : "Postulante rechazado técnicamente.",
        "success"
      );

      setSelectedAssignment(null);
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

  const handleSelectWinner = async (postulacion) => {
    const confirmed = window.confirm(
      `¿Seleccionar a "${postulacion.postulanteNombre}" como ganador de la vacante "${vacante.titulo}"?`
    );

    if (!confirmed) return;

    try {
      setSelectingWinnerId(postulacion.id);

      await vacanteService.selectWinner(vacante.id, postulacion.id);

      showMessage("Ganador seleccionado correctamente.", "success");

      await loadData();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo seleccionar al ganador.",
        "error"
      );
    } finally {
      setSelectingWinnerId(null);
    }
  };

  const answerClass = (answer) => {
    if (answer.esCorrecta === true) {
      return "text-emerald-700 bg-emerald-50 border-emerald-200";
    }

    if (answer.esCorrecta === false) {
      return "text-rose-700 bg-rose-50 border-rose-200";
    }

    return "text-slate-600 bg-slate-50 border-slate-200";
  };

  const answerLabel = (answer) => {
    if (answer.esCorrecta === true) return "Correcta";
    if (answer.esCorrecta === false) return "Incorrecta";
    return "Abierta";
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  if (loading) {
    return (
      <div>
        <SectionHeader
          title="Proceso técnico"
          description="Cargando información de la vacante."
        />

        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-black text-slate-900">
            Cargando proceso...
          </h2>
        </div>
      </div>
    );
  }

  if (!vacante) {
    return (
      <div>
        <SectionHeader
          title="Proceso no encontrado"
          description="No se pudo encontrar la vacante solicitada."
        />

        <Link
          to="/technical/vacantes"
          className="inline-flex items-center gap-2 text-emerald-700 font-black"
        >
          <ArrowLeft size={18} />
          Volver a procesos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Proceso técnico"
        description="Revisa candidatos, asigna evaluaciones, corrige resultados y selecciona ganador."
        action={
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-black"
          >
            <RefreshCw size={17} />
            Actualizar
          </button>
        }
      />

      {message && (
        <div
          className={`mb-5 border rounded-2xl px-4 py-3 text-sm font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <Link
        to="/technical/vacantes"
        className="inline-flex items-center gap-2 text-emerald-700 font-black mb-5"
      >
        <ArrowLeft size={18} />
        Volver a procesos técnicos
      </Link>

      <section className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black mb-3">
              {vacante.areaNombre}
            </span>

            <h1 className="text-3xl font-black text-slate-900">
              {vacante.titulo}
            </h1>

            <p className="text-sm text-slate-500 mt-2 max-w-3xl">
              {vacante.descripcion}
            </p>
          </div>

          <span
            className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${statusClass(
              vacante.estado
            )}`}
          >
            {getVacanteEstadoLabel(vacante.estado)}
          </span>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <Users size={18} className="text-emerald-600" />
          <p className="text-2xl font-black text-slate-900 mt-1">
            {stats.total}
          </p>
          <p className="text-xs text-slate-500">Candidatos</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <UserCheck size={18} className="text-emerald-600" />
          <p className="text-2xl font-black text-slate-900 mt-1">
            {stats.listos}
          </p>
          <p className="text-xs text-slate-500">Listos</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <Clock size={18} className="text-emerald-600" />
          <p className="text-2xl font-black text-slate-900 mt-1">
            {stats.enEvaluacion}
          </p>
          <p className="text-xs text-slate-500">En evaluación</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <Eye size={18} className="text-violet-600" />
          <p className="text-2xl font-black text-slate-900 mt-1">
            {stats.porRevisar}
          </p>
          <p className="text-xs text-slate-500">Por revisar</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <Trophy size={18} className="text-amber-600" />
          <p className="text-2xl font-black text-slate-900 mt-1">
            {stats.seleccionado}
          </p>
          <p className="text-xs text-slate-500">Seleccionado</p>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_230px] gap-3">
          <div className="flex items-center gap-3 border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
            <Search size={18} className="text-emerald-600" />

            <input
              type="text"
              placeholder="Buscar candidato o correo..."
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
            <option value="APROBADO_RRHH">Listos para evaluación</option>
            <option value="EVALUACION_PENDIENTE">Evaluación asignada</option>
            <option value="EVALUACION_COMPLETADA">Por revisar</option>
            <option value="APROBADO_TECNICO">Aptos para selección</option>
            <option value="RECHAZADO_TECNICO">No continúan</option>
            <option value="SELECCIONADO">Seleccionados</option>
            <option value="NO_SELECCIONADO">No seleccionados</option>
          </select>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="hidden lg:grid grid-cols-[1.4fr_1fr_1fr_0.8fr_280px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase">
          <span>Candidato</span>
          <span>Estado</span>
          <span>Evaluación</span>
          <span>Puntaje</span>
          <span className="text-right">Acción</span>
        </div>

        {candidatosFiltrados.length === 0 ? (
          <div className="p-8 text-center">
            <Briefcase size={34} className="mx-auto text-emerald-600" />

            <h2 className="text-xl font-black text-slate-900 mt-3">
              No hay candidatos para mostrar
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Ajusta los filtros o espera nuevas postulaciones.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {candidatosFiltrados.map((postulacion) => {
              const asignacion = getAsignacionByPostulacion(postulacion.id);

              const puedeAsignar = postulacion.estado === "APROBADO_RRHH";
              const debeRevisar = postulacion.estado === "EVALUACION_COMPLETADA";
              const puedeSeleccionar =
                postulacion.estado === "APROBADO_TECNICO";

              return (
                <div
                  key={postulacion.id}
                  className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr_280px] gap-4 px-5 py-4 items-center"
                >
                  <div>
                    <p className="font-black text-slate-900">
                      {postulacion.postulanteNombre}
                    </p>
                    <p className="text-sm text-slate-500">
                      {postulacion.postulanteCorreo}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Postuló: {formatDateTime(postulacion.fechaPostulacion)}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                        postulacion.estado
                      )}`}
                    >
                      {getPostulacionEstadoLabel(postulacion.estado)}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {asignacion?.evaluacionTitulo || "Sin asignar"}
                    </p>

                    {asignacion?.estado && (
                      <p className="text-xs text-slate-500 mt-1">
                        {getEvaluacionPostulacionEstadoLabel(asignacion.estado)}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="inline-flex items-center gap-1 text-sm font-black text-slate-800">
                      <Star size={15} className="text-amber-500" />
                      {asignacion?.puntajeObtenido ?? "Pendiente"}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:justify-end gap-2">
                    {puedeAsignar && (
                      <>
                        <select
                          value={selectedEvaluations[postulacion.id] || ""}
                          onChange={(e) =>
                            handleSelectEvaluation(
                              postulacion.id,
                              e.target.value
                            )
                          }
                          className="border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        >
                          <option value="">Evaluación</option>
                          {evaluacionesActivas.map((evaluacion) => (
                            <option key={evaluacion.id} value={evaluacion.id}>
                              {evaluacion.titulo}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          disabled={
                            assigningId === postulacion.id ||
                            evaluacionesActivas.length === 0
                          }
                          onClick={() => handleAssign(postulacion)}
                          className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-3 py-2 rounded-xl text-sm font-bold"
                        >
                          <Send size={15} />
                          Asignar
                        </button>
                      </>
                    )}

                    {debeRevisar && asignacion && (
                      <button
                        type="button"
                        onClick={() => openReviewModal(asignacion, postulacion)}
                        className="inline-flex items-center justify-center gap-1.5 border border-violet-200 bg-violet-50 hover:bg-violet-100 text-violet-700 px-3 py-2 rounded-xl text-sm font-bold"
                      >
                        <BookOpenCheck size={15} />
                        Revisar
                      </button>
                    )}

                    {puedeSeleccionar && (
                      <button
                        type="button"
                        disabled={selectingWinnerId === postulacion.id}
                        onClick={() => handleSelectWinner(postulacion)}
                        className="inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white px-3 py-2 rounded-xl text-sm font-bold"
                      >
                        <Award size={15} />
                        Ganador
                      </button>
                    )}

                    {!puedeAsignar && !debeRevisar && !puedeSeleccionar && (
                      <span className="text-sm text-slate-400 lg:text-right">
                        Sin acción
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-6 bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Evaluaciones de esta vacante
            </h2>
            <p className="text-sm text-slate-500">
              Evaluaciones disponibles para asignar a los candidatos.
            </p>
          </div>

          <Link
            to="/technical/evaluaciones/create"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-black"
          >
            <BookOpenCheck size={17} />
            Crear evaluación
          </Link>
        </div>

        {evaluaciones.length === 0 ? (
          <div className="mt-4 border border-amber-200 bg-amber-50 text-amber-700 rounded-xl p-4 text-sm font-semibold">
            Aún no hay evaluaciones para esta vacante.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {evaluaciones.map((evaluacion) => (
              <div
                key={evaluacion.id}
                className="border border-slate-200 rounded-xl p-4"
              >
                <p className="font-black text-slate-900">
                  {evaluacion.titulo}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {evaluacion.preguntas?.length || 0} pregunta(s) ·{" "}
                  {evaluacion.duracionMinutos} min
                </p>
                <span
                  className={`inline-flex mt-3 px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                    evaluacion.estado
                  )}`}
                >
                  {getEvaluacionEstadoLabel(evaluacion.estado)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center px-4 py-8">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Revisar evaluación
                </h2>
                <p className="text-sm text-slate-500">
                  {selectedAssignment.postulacion?.postulanteNombre} ·{" "}
                  {selectedAssignment.evaluacionTitulo}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAssignment(null)}
                className="w-9 h-9 rounded-xl border border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">Candidato</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedAssignment.postulacion?.postulanteNombre}
                  </p>
                  <p className="text-sm text-slate-500">
                    {selectedAssignment.postulacion?.postulanteCorreo}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">
                    Evaluación
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedAssignment.evaluacionTitulo}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">
                    Puntaje actual
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedAssignment.puntajeObtenido ?? 0}
                  </p>
                </div>
              </section>

              <section>
                <h3 className="font-black text-slate-900 mb-3">Respuestas</h3>

                {selectedAssignment.respuestas?.length === 0 ||
                !selectedAssignment.respuestas ? (
                  <div className="border border-slate-200 rounded-xl p-4 text-slate-500">
                    No hay respuestas registradas.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedAssignment.respuestas.map((answer, index) => (
                      <div
                        key={answer.id || index}
                        className="border border-slate-200 rounded-xl p-4"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div>
                            <p className="text-xs font-black text-slate-500">
                              Pregunta {index + 1}
                            </p>
                            <p className="font-bold text-slate-900 mt-1">
                              {answer.preguntaEnunciado}
                            </p>
                          </div>

                          <span
                            className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${answerClass(
                              answer
                            )}`}
                          >
                            {answerLabel(answer)}
                          </span>
                        </div>

                        <p className="text-sm text-slate-700 mt-3 whitespace-pre-wrap">
                          {answer.opcionTexto ||
                            answer.respuestaTexto ||
                            "Sin respuesta"}
                        </p>

                        <p className="text-xs text-slate-500 mt-3">
                          Puntaje obtenido:{" "}
                          <strong>{answer.puntajeObtenido ?? 0}</strong>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="border border-slate-200 rounded-xl p-4">
                <h3 className="font-black text-slate-900 mb-3">
                  Revisión técnica
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Puntaje final
                    </label>

                    <input
                      type="text"
                      inputMode="decimal"
                      value={
                        reviewForms[selectedAssignment.id]?.puntajeObtenido ||
                        ""
                      }
                      onChange={(e) =>
                        handleReviewFormChange(
                          selectedAssignment.id,
                          "puntajeObtenido",
                          e.target.value
                        )
                      }
                      className="input-light"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Comentario
                    </label>

                    <textarea
                      value={
                        reviewForms[selectedAssignment.id]?.comentarioTecnico ||
                        ""
                      }
                      onChange={(e) =>
                        handleReviewFormChange(
                          selectedAssignment.id,
                          "comentarioTecnico",
                          e.target.value
                        )
                      }
                      placeholder="Comentario breve sobre el resultado técnico."
                      className="w-full min-h-24 border border-slate-300 rounded-xl p-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2 mt-4">
                  <button
                    type="button"
                    disabled={reviewingId === selectedAssignment.id}
                    onClick={() =>
                      handleTechnicalReview(selectedAssignment, true)
                    }
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl text-sm font-black"
                  >
                    <UserCheck size={17} />
                    Aprobar técnico
                  </button>

                  <button
                    type="button"
                    disabled={reviewingId === selectedAssignment.id}
                    onClick={() =>
                      handleTechnicalReview(selectedAssignment, false)
                    }
                    className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl text-sm font-black"
                  >
                    <UserX size={17} />
                    Rechazar técnico
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TechnicalJobDetail;