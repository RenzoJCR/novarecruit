import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Plus,
  Search,
  RefreshCw,
  MapPin,
  Calendar,
  DollarSign,
  Layers,
  Trash2,
  Activity,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { vacanteService } from "../../services/vacanteService.js";
import { logService } from "../../services/logService.js";

function RrhhJobs() {
  const navigate = useNavigate();

  const [vacantes, setVacantes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  const [loadingVacantes, setLoadingVacantes] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const filteredVacantes = useMemo(() => {
    const value = search.toLowerCase().trim();

    return vacantes.filter((vacante) => {
      const matchesSearch =
        vacante.titulo?.toLowerCase().includes(value) ||
        vacante.areaNombre?.toLowerCase().includes(value) ||
        vacante.modalidad?.toLowerCase().includes(value);

      const matchesStatus =
        selectedStatus === "Todos" || vacante.estado === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [vacantes, search, selectedStatus]);

  const activeVacantes = vacantes.filter(
    (vacante) => vacante.estado === "ACTIVA"
  ).length;

  const closedVacantes = vacantes.filter(
    (vacante) => vacante.estado === "CERRADA"
  ).length;

  const loadVacantes = async () => {
    try {
      setLoadingVacantes(true);
      const data = await vacanteService.getAll();
      setVacantes(data);
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudieron cargar las vacantes.",
        "error"
      );
    } finally {
      setLoadingVacantes(false);
    }
  };

  const loadLogs = async () => {
    try {
      setLoadingLogs(true);
      const data = await logService.getLatest();
      const vacancyLogs = data
        .filter((log) => log.modulo === "VACANTES")
        .slice(0, 5);
      setLogs(vacancyLogs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const refreshData = async () => {
    await Promise.all([loadVacantes(), loadLogs()]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 3500);
  };

  const handleCancelVacante = async (vacante) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas cancelar la vacante "${vacante.titulo}"?`
    );

    if (!confirmed) return;

    try {
      await vacanteService.cancel(vacante.id);
      showMessage("Vacante cancelada correctamente.", "success");
      await refreshData();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo cancelar la vacante.",
        "error"
      );
    }
  };

  const formatDate = (value) => {
    if (!value) return "Sin fecha";

    return new Date(value).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const formatDateTime = (value) => {
    if (!value) return "Sin fecha";

    return new Date(value).toLocaleString("es-PE", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined) return "No especificado";

    return Number(value).toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
    });
  };

  const statusClass = (status) => {
    const styles = {
      ACTIVA: "bg-emerald-50 text-emerald-700 border-emerald-200",
      EN_PROCESO: "bg-sky-50 text-sky-700 border-sky-200",
      CERRADA: "bg-slate-50 text-slate-600 border-slate-200",
      CANCELADA: "bg-rose-50 text-rose-700 border-rose-200",
    };

    return styles[status] || "bg-slate-50 text-slate-600 border-slate-200";
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div>
      <SectionHeader
        title="Gestión de vacantes"
        description="Administra las vacantes creadas por Recursos Humanos y sus requisitos técnicos."
        action={
          <button
            onClick={() => navigate("/rrhh/vacantes/create")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white px-5 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20"
          >
            <Plus size={18} />
            Crear vacante
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Vacantes</p>
          <p className="text-4xl font-black text-slate-900 mt-2">
            {vacantes.length}
          </p>
        </div>

        <div className="bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Activas</p>
          <p className="text-4xl font-black text-emerald-600 mt-2">
            {activeVacantes}
          </p>
        </div>

        <div className="bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Cerradas</p>
          <p className="text-4xl font-black text-sky-600 mt-2">
            {closedVacantes}
          </p>
        </div>
      </div>

      <div className="bg-white/95 border border-slate-200 rounded-[2rem] p-5 mb-8 grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-4 shadow-sm">
        <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
          <Search size={18} className="text-emerald-600" />
          <input
            type="text"
            placeholder="Buscar por título, área o modalidad..."
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
          <option value="ACTIVA">Activa</option>
          <option value="EN_PROCESO">En proceso</option>
          <option value="CERRADA">Cerrada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>

        <button
          type="button"
          onClick={refreshData}
          className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-2xl font-black"
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {loadingVacantes ? (
        <div className="bg-white/95 border border-slate-200 rounded-[2rem] p-10 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-900">
            Cargando vacantes...
          </h2>
          <p className="text-slate-500 mt-2">
            Consultando información desde el backend.
          </p>
        </div>
      ) : filteredVacantes.length === 0 ? (
        <div className="bg-white/95 border border-slate-200 rounded-[2rem] p-10 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-900">
            No se encontraron vacantes
          </h2>
          <p className="text-slate-500 mt-2">
            Crea una nueva vacante o cambia los filtros de búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredVacantes.map((vacante) => (
            <article
              key={vacante.id}
              className="bg-white/95 border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black mb-3">
                    {vacante.areaNombre}
                  </span>

                  <h3 className="text-2xl font-black text-slate-900">
                    {vacante.titulo}
                  </h3>

                  <p className="text-slate-500 mt-2 leading-relaxed line-clamp-3">
                    {vacante.descripcion}
                  </p>
                </div>

                <span
                  className={`inline-flex px-3 py-1.5 rounded-full border text-xs font-black ${statusClass(
                    vacante.estado
                  )}`}
                >
                  {vacante.estado}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={17} className="text-emerald-600" />
                  {vacante.modalidad} · {vacante.ubicacion || "Sin ubicación"}
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <DollarSign size={17} className="text-emerald-600" />
                  {formatMoney(vacante.salario)}
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar size={17} className="text-emerald-600" />
                  Cierre: {formatDate(vacante.fechaCierre)}
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Briefcase size={17} className="text-emerald-600" />
                  {vacante.nivelExperiencia}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-black text-slate-900 mb-3">
                  Habilidades requeridas
                </h4>

                <div className="flex flex-wrap gap-2">
                  {vacante.habilidades?.map((item) => (
                    <span
                      key={item.id}
                      className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200"
                    >
                      {item.habilidadNombre} · {item.nivelRequerido}
                      {item.obligatorio ? " · Oblig." : " · Opc."}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Layers size={17} className="text-emerald-600" />
                  Creada por {vacante.rrhhNombre}
                </div>

                {vacante.estado !== "CANCELADA" &&
                  vacante.estado !== "CERRADA" && (
                    <button
                      type="button"
                      onClick={() => handleCancelVacante(vacante)}
                      className="inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 px-4 py-2 rounded-2xl font-black"
                    >
                      <Trash2 size={17} />
                      Cancelar
                    </button>
                  )}
              </div>
            </article>
          ))}
        </div>
      )}

      <section className="mt-8 bg-white/95 border border-slate-200 rounded-[2rem] p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center">
            <Activity size={24} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900">
              Actividad reciente de vacantes
            </h2>
            <p className="text-sm text-slate-500">
              Últimos registros generados desde el backend.
            </p>
          </div>
        </div>

        {loadingLogs ? (
          <p className="text-slate-500">Cargando logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-slate-500">No hay logs recientes de vacantes.</p>
        ) : (
          <div className="space-y-3">
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

export default RrhhJobs;