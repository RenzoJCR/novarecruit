import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpenCheck,
  Clock,
  Eye,
  FileQuestion,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { evaluacionService } from "../../services/evaluacionService.js";

function TechnicalEvaluations() {
  const navigate = useNavigate();

  const [evaluaciones, setEvaluaciones] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  const [loading, setLoading] = useState(true);
  const [deactivatingId, setDeactivatingId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const loadEvaluaciones = async () => {
    try {
      setLoading(true);
      const data = await evaluacionService.getAll();
      setEvaluaciones(data);

      if (selectedEvaluation) {
        const updated = data.find((item) => item.id === selectedEvaluation.id);
        setSelectedEvaluation(updated || null);
      }
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudieron cargar las evaluaciones.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvaluaciones();
  }, []);

  const filteredEvaluaciones = useMemo(() => {
    const value = search.toLowerCase().trim();

    return evaluaciones.filter((evaluacion) => {
      const matchesSearch =
        evaluacion.titulo?.toLowerCase().includes(value) ||
        evaluacion.vacanteTitulo?.toLowerCase().includes(value) ||
        evaluacion.tecnicoNombre?.toLowerCase().includes(value);

      const matchesStatus =
        selectedStatus === "Todos" || evaluacion.estado === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [evaluaciones, search, selectedStatus]);

  const totalActivas = evaluaciones.filter(
    (item) => item.estado === "ACTIVA"
  ).length;

  const totalInactivas = evaluaciones.filter(
    (item) => item.estado === "INACTIVA"
  ).length;

  const totalPreguntas = evaluaciones.reduce(
    (total, item) => total + (item.preguntas?.length || 0),
    0
  );

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const handleDeactivate = async (evaluacion) => {
    const confirmed = window.confirm(
      `¿Deseas desactivar la evaluación "${evaluacion.titulo}"?`
    );

    if (!confirmed) return;

    try {
      setDeactivatingId(evaluacion.id);
      await evaluacionService.deactivate(evaluacion.id);

      showMessage("Evaluación desactivada correctamente.", "success");
      await loadEvaluaciones();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo desactivar la evaluación.",
        "error"
      );
    } finally {
      setDeactivatingId(null);
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
      ACTIVA: "bg-emerald-50 text-emerald-700 border-emerald-200",
      INACTIVA: "bg-slate-50 text-slate-600 border-slate-200",
    };

    return styles[status] || "bg-slate-50 text-slate-600 border-slate-200";
  };

  const questionTypeLabel = (type) => {
    const labels = {
      MULTIPLE: "Opción múltiple",
      VERDADERO_FALSO: "Verdadero/Falso",
      TEXTO: "Texto",
      CODIGO: "Código",
    };

    return labels[type] || type;
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div>
      <SectionHeader
        title="Evaluaciones técnicas"
        description="Banco de evaluaciones creadas para las vacantes del proceso técnico."
        action={
          <button
            onClick={() => navigate("/technical/evaluaciones/create")}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-black"
          >
            <Plus size={17} />
            Crear evaluación
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

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Activas</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">
            {totalActivas}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Inactivas</p>
          <p className="text-3xl font-black text-slate-700 mt-1">
            {totalInactivas}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Preguntas</p>
          <p className="text-3xl font-black text-sky-600 mt-1">
            {totalPreguntas}
          </p>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3">
        <div className="flex items-center gap-3 border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
          <Search size={18} className="text-emerald-600" />
          <input
            type="text"
            placeholder="Buscar por evaluación, vacante o técnico..."
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
          <option value="ACTIVA">Activa</option>
          <option value="INACTIVA">Inactiva</option>
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
          <BookOpenCheck size={36} className="mx-auto text-emerald-600" />
          <h2 className="text-xl font-black text-slate-900 mt-3">
            No hay evaluaciones para mostrar
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Crea una evaluación para poder asignarla a candidatos.
          </p>
        </div>
      ) : (
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1.4fr_1.2fr_0.7fr_0.7fr_180px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase">
            <span>Evaluación</span>
            <span>Vacante</span>
            <span>Preguntas</span>
            <span>Estado</span>
            <span className="text-right">Acciones</span>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredEvaluaciones.map((evaluacion) => (
              <div
                key={evaluacion.id}
                className="grid grid-cols-1 lg:grid-cols-[1.4fr_1.2fr_0.7fr_0.7fr_180px] gap-4 px-5 py-4 items-center"
              >
                <div>
                  <p className="font-black text-slate-900">
                    {evaluacion.titulo}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {evaluacion.descripcion || "Sin descripción"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Técnico: {evaluacion.tecnicoNombre || "No asignado"}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-slate-800">
                    {evaluacion.vacanteTitulo}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Creada: {formatDateTime(evaluacion.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-slate-700 font-black">
                  <FileQuestion size={17} className="text-emerald-600" />
                  {evaluacion.preguntas?.length || 0}
                </div>

                <div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                      evaluacion.estado
                    )}`}
                  >
                    {evaluacion.estado}
                  </span>
                </div>

                <div className="flex flex-wrap justify-start lg:justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEvaluation(evaluacion)}
                    className="inline-flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-sm font-bold"
                  >
                    <Eye size={16} />
                    Ver
                  </button>

                  {evaluacion.estado === "ACTIVA" && (
                    <button
                      type="button"
                      disabled={deactivatingId === evaluacion.id}
                      onClick={() => handleDeactivate(evaluacion)}
                      className="inline-flex items-center gap-1.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 disabled:bg-slate-100 text-rose-700 disabled:text-slate-500 px-3 py-2 rounded-xl text-sm font-bold"
                    >
                      <Trash2 size={16} />
                      Desactivar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedEvaluation && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center px-4 py-8">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Detalle de evaluación
                </h2>
                <p className="text-sm text-slate-500">
                  {selectedEvaluation.vacanteTitulo}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEvaluation(null)}
                className="w-9 h-9 rounded-xl border border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <section className="border border-slate-200 rounded-xl p-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      {selectedEvaluation.titulo}
                    </h3>

                    <p className="text-sm text-slate-500 mt-2">
                      {selectedEvaluation.descripcion || "Sin descripción"}
                    </p>
                  </div>

                  <span
                    className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                      selectedEvaluation.estado
                    )}`}
                  >
                    {selectedEvaluation.estado}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
                  <div className="border border-slate-200 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock size={17} className="text-emerald-600" />
                      <p className="text-sm font-black">
                        {selectedEvaluation.duracionMinutos} min
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Duración</p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-3">
                    <p className="text-sm font-black text-slate-700">
                      {selectedEvaluation.puntajeMaximo}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Puntaje máximo
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-3">
                    <p className="text-sm font-black text-slate-700">
                      {selectedEvaluation.preguntas?.length || 0}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Preguntas</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-black text-slate-900 mb-3">
                  Preguntas registradas
                </h3>

                {selectedEvaluation.preguntas?.length === 0 ? (
                  <div className="border border-slate-200 rounded-xl p-4 text-slate-500">
                    No hay preguntas registradas.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedEvaluation.preguntas?.map((pregunta) => (
                      <div
                        key={pregunta.id}
                        className="border border-slate-200 rounded-xl p-4"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div>
                            <p className="text-xs font-black text-slate-500">
                              Pregunta {pregunta.orden}
                            </p>

                            <p className="font-bold text-slate-900 mt-1">
                              {pregunta.enunciado}
                            </p>
                          </div>

                          <span className="inline-flex px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-black text-slate-600">
                            {questionTypeLabel(pregunta.tipoPregunta)} ·{" "}
                            {pregunta.puntaje} pts
                          </span>
                        </div>

                        {pregunta.opciones?.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {pregunta.opciones.map((opcion) => (
                              <div
                                key={opcion.id}
                                className={`rounded-xl border px-3 py-2 text-sm ${
                                  opcion.esCorrecta
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                    : "bg-slate-50 border-slate-200 text-slate-600"
                                }`}
                              >
                                {opcion.texto}
                                {opcion.esCorrecta && (
                                  <strong className="ml-2">(correcta)</strong>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
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

export default TechnicalEvaluations;