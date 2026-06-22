import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BookOpenCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Send,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { vacanteService } from "../../services/vacanteService.js";
import { postulacionService } from "../../services/postulacionService.js";
import { evaluacionService } from "../../services/evaluacionService.js";
import { evaluacionPostulacionService } from "../../services/evaluacionPostulacionService.js";

function TechnicalJobDetail() {
  const { id } = useParams();

  const [vacante, setVacante] = useState(null);
  const [postulaciones, setPostulaciones] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  const [selectedEvaluations, setSelectedEvaluations] = useState({});
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);
  const [selectingWinnerId, setSelectingWinnerId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

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

      setVacante(vacanteData);
      setPostulaciones(postulacionesData);
      setEvaluaciones(evaluacionesData);
      setAsignaciones(
        asignacionesData.filter(
          (item) => Number(item.vacanteId) === Number(id)
        )
      );
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
      const estadoVisible = getEstadoVisible(postulacion.estado).toLowerCase();

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
      aptos: postulaciones.filter((item) => item.estado === "APROBADO_TECNICO")
        .length,
      seleccionado: postulaciones.filter((item) => item.estado === "SELECCIONADO")
        .length,
    };
  }, [postulaciones]);

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

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

  const getEstadoVisible = (estado) => {
    const labels = {
      POSTULADO: "Postulado",
      EN_REVISION_RRHH: "En revisión",
      APROBADO_RRHH: "Listo para evaluación",
      RECHAZADO_RRHH: "No continúa",
      EVALUACION_PENDIENTE: "Evaluación asignada",
      EVALUACION_COMPLETADA: "Por revisar",
      APROBADO_TECNICO: "Apto para selección",
      RECHAZADO_TECNICO: "No continúa",
      SELECCIONADO: "Seleccionado",
      NO_SELECCIONADO: "No seleccionado",
    };

    return labels[estado] || estado || "Sin estado";
  };

  const statusClass = (estado) => {
    const styles = {
      POSTULADO: "bg-slate-50 text-slate-600 border-slate-200",
      EN_REVISION_RRHH: "bg-sky-50 text-sky-700 border-sky-200",
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
        description="Revisa los candidatos de esta vacante y asigna evaluaciones cuando corresponda."
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

          <span className="inline-flex px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200 text-xs font-black">
            {vacante.estado}
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
          <CheckCircle2 size={18} className="text-emerald-600" />
          <p className="text-2xl font-black text-slate-900 mt-1">
            {stats.aptos}
          </p>
          <p className="text-xs text-slate-500">Aptos</p>
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
        <div className="hidden lg:grid grid-cols-[1.4fr_1fr_1fr_1fr_250px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase">
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
              const puedeSeleccionar = postulacion.estado === "APROBADO_TECNICO";
              const debeRevisar = postulacion.estado === "EVALUACION_COMPLETADA";

              return (
                <div
                  key={postulacion.id}
                  className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1fr_250px] gap-4 px-5 py-4 items-center"
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
                      {getEstadoVisible(postulacion.estado)}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {asignacion?.evaluacionTitulo || "Sin asignar"}
                    </p>
                    {asignacion?.fechaAsignacion && (
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDateTime(asignacion.fechaAsignacion)}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-800">
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

                    {debeRevisar && (
                      <Link
                        to="/technical/resultados"
                        className="inline-flex items-center justify-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-sm font-bold"
                      >
                        <BookOpenCheck size={15} />
                        Revisar
                      </Link>
                    )}

                    {puedeSeleccionar && (
                      <button
                        type="button"
                        disabled={selectingWinnerId === postulacion.id}
                        onClick={() => handleSelectWinner(postulacion)}
                        className="inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white px-3 py-2 rounded-xl text-sm font-bold"
                      >
                        <Award size={15} />
                        Seleccionar
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
              Estas son las evaluaciones disponibles para asignar a los
              candidatos de este proceso.
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
                <span className="inline-flex mt-3 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-black text-slate-600">
                  {evaluacion.estado}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TechnicalJobDetail;