import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpenCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  FileQuestion,
  RefreshCw,
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
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);

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
        asignacionesData.filter((item) => Number(item.vacanteId) === Number(id))
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

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const evaluacionesActivas = useMemo(() => {
    return evaluaciones.filter((item) => item.estado === "ACTIVA");
  }, [evaluaciones]);

  const candidatosParaAsignar = useMemo(() => {
    return postulaciones.filter((item) => item.estado === "APROBADO_RRHH");
  }, [postulaciones]);

  const candidatosEnEvaluacion = useMemo(() => {
    return postulaciones.filter((item) =>
      ["EVALUACION_PENDIENTE", "EVALUACION_COMPLETADA"].includes(item.estado)
    );
  }, [postulaciones]);

  const candidatosTecnicos = useMemo(() => {
    return postulaciones.filter((item) =>
      [
        "APROBADO_TECNICO",
        "RECHAZADO_TECNICO",
        "SELECCIONADO",
        "NO_SELECCIONADO",
      ].includes(item.estado)
    );
  }, [postulaciones]);

  const asignacionesCompletadas = useMemo(() => {
    return asignaciones.filter((item) =>
      ["COMPLETADA", "REVISADA"].includes(item.estado)
    );
  }, [asignaciones]);

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

  const formatDateTime = (value) => {
    if (!value) return "Sin fecha";

    return new Date(value).toLocaleString("es-PE", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const statusClass = (status) => {
    const styles = {
      APROBADO_RRHH: "bg-emerald-50 text-emerald-700 border-emerald-200",
      EVALUACION_PENDIENTE: "bg-indigo-50 text-indigo-700 border-indigo-200",
      EVALUACION_COMPLETADA: "bg-violet-50 text-violet-700 border-violet-200",
      APROBADO_TECNICO: "bg-emerald-50 text-emerald-700 border-emerald-200",
      RECHAZADO_TECNICO: "bg-rose-50 text-rose-700 border-rose-200",
      SELECCIONADO: "bg-amber-50 text-amber-700 border-amber-200",
      NO_SELECCIONADO: "bg-slate-50 text-slate-600 border-slate-200",
    };

    return styles[status] || "bg-slate-50 text-slate-600 border-slate-200";
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
          description="Cargando detalle de la vacante."
        />

        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
          <h2 className="text-2xl font-black text-slate-900">
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
        title="Detalle del proceso técnico"
        description="Gestiona los candidatos y evaluaciones de esta vacante."
        action={
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-2xl font-black"
          >
            <RefreshCw size={18} />
            Actualizar
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

      <Link
        to="/technical/vacantes"
        className="inline-flex items-center gap-2 text-emerald-700 font-black mb-6"
      >
        <ArrowLeft size={18} />
        Volver a procesos técnicos
      </Link>

      <section className="bg-white border border-slate-200 rounded-[2rem] p-7 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div>
            <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black mb-3">
              {vacante.areaNombre}
            </span>

            <h1 className="text-4xl font-black text-slate-900">
              {vacante.titulo}
            </h1>

            <p className="text-slate-500 mt-3 leading-relaxed">
              {vacante.descripcion}
            </p>
          </div>

          <span className="inline-flex px-4 py-2 rounded-full bg-slate-50 text-slate-700 border border-slate-200 text-sm font-black">
            {vacante.estado}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-7">
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <Users size={20} className="text-emerald-600" />
            <p className="text-2xl font-black text-slate-900 mt-2">
              {postulaciones.length}
            </p>
            <p className="text-xs text-slate-500">Postulantes</p>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <UserCheck size={20} className="text-emerald-600" />
            <p className="text-2xl font-black text-slate-900 mt-2">
              {candidatosParaAsignar.length}
            </p>
            <p className="text-xs text-slate-500">Por asignar</p>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <FileQuestion size={20} className="text-emerald-600" />
            <p className="text-2xl font-black text-slate-900 mt-2">
              {evaluaciones.length}
            </p>
            <p className="text-xs text-slate-500">Evaluaciones</p>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <Clock size={20} className="text-emerald-600" />
            <p className="text-2xl font-black text-slate-900 mt-2">
              {candidatosEnEvaluacion.length}
            </p>
            <p className="text-xs text-slate-500">En evaluación</p>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <Trophy size={20} className="text-amber-600" />
            <p className="text-2xl font-black text-slate-900 mt-2">
              {candidatosTecnicos.filter((item) => item.estado === "SELECCIONADO").length}
            </p>
            <p className="text-xs text-slate-500">Seleccionado</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <main className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Candidatos listos para evaluación
                </h2>
                <p className="text-sm text-slate-500">
                  Postulantes aprobados por RRHH para esta vacante.
                </p>
              </div>

              <Link
                to="/technical/evaluaciones/create"
                className="inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-2xl font-black"
              >
                <BookOpenCheck size={17} />
                Crear evaluación
              </Link>
            </div>

            {candidatosParaAsignar.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 text-center">
                <CheckCircle2 size={34} className="mx-auto text-emerald-600" />
                <p className="font-black text-slate-900 mt-3">
                  No hay candidatos pendientes de asignación
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Cuando RRHH apruebe postulaciones, aparecerán aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {candidatosParaAsignar.map((postulacion) => (
                  <div
                    key={postulacion.id}
                    className="rounded-3xl bg-slate-50 border border-slate-200 p-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <p className="text-lg font-black text-slate-900">
                          {postulacion.postulanteNombre}
                        </p>
                        <p className="text-sm text-slate-500">
                          {postulacion.postulanteCorreo}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Postuló: {formatDateTime(postulacion.fechaPostulacion)}
                        </p>
                      </div>

                      <span
                        className={`inline-flex justify-center px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                          postulacion.estado
                        )}`}
                      >
                        {postulacion.estado}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {postulacion.habilidades?.map((item) => (
                        <span
                          key={item.id}
                          className="px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600"
                        >
                          {item.habilidadNombre} · {item.nivelPostulante}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                      <select
                        value={selectedEvaluations[postulacion.id] || ""}
                        onChange={(e) =>
                          handleSelectEvaluation(postulacion.id, e.target.value)
                        }
                        className="input-light"
                      >
                        <option value="">Selecciona evaluación</option>
                        {evaluacionesActivas.map((evaluacion) => (
                          <option key={evaluacion.id} value={evaluacion.id}>
                            {evaluacion.titulo} ·{" "}
                            {evaluacion.preguntas?.length || 0} pregunta(s)
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleAssign(postulacion)}
                        disabled={
                          assigningId === postulacion.id ||
                          evaluacionesActivas.length === 0
                        }
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 disabled:from-slate-300 disabled:to-slate-300 text-white px-5 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20 disabled:shadow-none"
                      >
                        <Send size={17} />
                        {assigningId === postulacion.id
                          ? "Asignando..."
                          : "Asignar"}
                      </button>
                    </div>

                    {evaluacionesActivas.length === 0 && (
                      <div className="mt-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 p-3 text-sm font-semibold">
                        No hay evaluaciones activas para esta vacante. Primero
                        crea una evaluación.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">
              Candidatos en evaluación
            </h2>
            <p className="text-sm text-slate-500 mt-1 mb-5">
              Postulantes que ya tienen evaluación asignada o completada.
            </p>

            {candidatosEnEvaluacion.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 text-center text-slate-500">
                No hay candidatos en evaluación.
              </div>
            ) : (
              <div className="space-y-3">
                {candidatosEnEvaluacion.map((postulacion) => {
                  const asignacion = getAsignacionByPostulacion(postulacion.id);

                  return (
                    <div
                      key={postulacion.id}
                      className="rounded-3xl bg-slate-50 border border-slate-200 p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                    >
                      <div>
                        <p className="font-black text-slate-900">
                          {postulacion.postulanteNombre}
                        </p>
                        <p className="text-sm text-slate-500">
                          {postulacion.postulanteCorreo}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Evaluación:{" "}
                          {asignacion?.evaluacionTitulo || "Sin detalle"}
                        </p>
                      </div>

                      <span
                        className={`inline-flex justify-center px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                          postulacion.estado
                        )}`}
                      >
                        {postulacion.estado}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Resultados disponibles
                </h2>
                <p className="text-sm text-slate-500">
                  Evaluaciones completadas o revisadas de esta vacante.
                </p>
              </div>

              <Link
                to="/technical/resultados"
                className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-2xl font-black"
              >
                Ver resultados
              </Link>
            </div>

            {asignacionesCompletadas.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 text-center text-slate-500">
                Aún no hay evaluaciones completadas.
              </div>
            ) : (
              <div className="space-y-3">
                {asignacionesCompletadas.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-slate-50 border border-slate-200 p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                  >
                    <div>
                      <p className="font-black text-slate-900">
                        {item.postulanteNombre}
                      </p>
                      <p className="text-sm text-slate-500">
                        {item.evaluacionTitulo}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Enviada: {formatDateTime(item.fechaEnvio)}
                      </p>
                    </div>

                    <div className="text-left lg:text-right">
                      <span className="inline-flex px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-black text-slate-600">
                        {item.estado}
                      </span>
                      <p className="text-sm text-slate-500 mt-2">
                        Puntaje:{" "}
                        <strong>{item.puntajeObtenido ?? "Pendiente"}</strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        <aside className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">
              Evaluaciones de la vacante
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Solo estas evaluaciones se pueden asignar a candidatos de esta
              vacante.
            </p>

            {evaluaciones.length === 0 ? (
              <div className="mt-5 rounded-3xl bg-amber-50 border border-amber-100 p-4 text-amber-700 text-sm font-semibold">
                Todavía no hay evaluaciones creadas para esta vacante.
              </div>
            ) : (
              <div className="space-y-3 mt-5">
                {evaluaciones.map((evaluacion) => (
                  <div
                    key={evaluacion.id}
                    className="rounded-3xl bg-slate-50 border border-slate-200 p-4"
                  >
                    <p className="font-black text-slate-900">
                      {evaluacion.titulo}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {evaluacion.preguntas?.length || 0} pregunta(s) ·{" "}
                      {evaluacion.duracionMinutos} min
                    </p>
                    <span className="inline-flex mt-3 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-black text-slate-600">
                      {evaluacion.estado}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">
              Resultado final
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              El ganador final se selecciona desde resultados técnicos.
            </p>

            {candidatosTecnicos.length === 0 ? (
              <div className="mt-5 rounded-3xl bg-slate-50 border border-slate-200 p-4 text-slate-500 text-sm">
                Aún no hay candidatos aprobados o rechazados técnicamente.
              </div>
            ) : (
              <div className="space-y-3 mt-5">
                {candidatosTecnicos.map((postulacion) => (
                  <div
                    key={postulacion.id}
                    className="rounded-3xl bg-slate-50 border border-slate-200 p-4"
                  >
                    <p className="font-black text-slate-900">
                      {postulacion.postulanteNombre}
                    </p>
                    <span
                      className={`inline-flex mt-2 px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                        postulacion.estado
                      )}`}
                    >
                      {postulacion.estado}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

export default TechnicalJobDetail;