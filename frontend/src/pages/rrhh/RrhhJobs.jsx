import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  Eye,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { vacanteService } from "../../services/vacanteService.js";

function getEstadoVisible(estado) {
  const labels = {
    ACTIVA: "Activa",
    EN_PROCESO: "En proceso",
    CERRADA: "Cerrada",
    CANCELADA: "Cancelada",
  };

  return labels[estado] || estado || "Sin estado";
}

function statusClass(estado) {
  const styles = {
    ACTIVA: "bg-emerald-50 text-emerald-700 border-emerald-200",
    EN_PROCESO: "bg-amber-50 text-amber-700 border-amber-200",
    CERRADA: "bg-slate-50 text-slate-600 border-slate-200",
    CANCELADA: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return styles[estado] || "bg-slate-50 text-slate-600 border-slate-200";
}

function formatDate(value) {
  if (!value) return "Sin fecha";

  return new Date(`${value}T00:00:00`).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function formatMoney(value) {
  if (value === null || value === undefined) return "No especificado";

  return Number(value).toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
  });
}

function RrhhJobs() {
  const [vacantes, setVacantes] = useState([]);
  const [selectedVacante, setSelectedVacante] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const loadVacantes = async () => {
    try {
      setLoading(true);

      const data = await vacanteService.getAll();
      setVacantes(data);

      if (selectedVacante) {
        const updated = data.find((item) => item.id === selectedVacante.id);
        setSelectedVacante(updated || null);
      }
    } catch (error) {
      showMessage(error.userMessage || "No se pudieron cargar las vacantes.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVacantes();
  }, []);

  const filteredVacantes = useMemo(() => {
    const value = search.toLowerCase().trim();

    return vacantes.filter((vacante) => {
      const estadoVisible = getEstadoVisible(vacante.estado).toLowerCase();

      const matchesSearch =
        vacante.titulo?.toLowerCase().includes(value) ||
        vacante.areaNombre?.toLowerCase().includes(value) ||
        vacante.modalidad?.toLowerCase().includes(value) ||
        vacante.ubicacion?.toLowerCase().includes(value) ||
        estadoVisible.includes(value);

      const matchesStatus =
        selectedStatus === "Todos" || vacante.estado === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [vacantes, search, selectedStatus]);

  const activas = vacantes.filter((item) => item.estado === "ACTIVA").length;
  const enProceso = vacantes.filter((item) => item.estado === "EN_PROCESO").length;
  const cerradas = vacantes.filter((item) => item.estado === "CERRADA").length;

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4000);
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
      await loadVacantes();
    } catch (error) {
      showMessage(error.userMessage || "No se pudo cancelar la vacante.", "error");
    } finally {
      setCancelingId(null);
    }
  };

  const canCancel = (vacante) => {
    return vacante.estado !== "CERRADA" && vacante.estado !== "CANCELADA";
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div>
      <SectionHeader
        title="Vacantes"
        description="Gestiona las vacantes publicadas para el proceso de reclutamiento."
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
          <p className="text-sm text-slate-500 font-semibold">Activas</p>
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
          <p className="text-sm text-slate-500 font-semibold">Cerradas</p>
          <p className="text-3xl font-black text-slate-700 mt-1">
            {cerradas}
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
          onClick={loadVacantes}
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
          <p className="text-slate-500 mt-1">Un momento por favor.</p>
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
          <div className="hidden lg:grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_170px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase">
            <span>Vacante</span>
            <span>Área</span>
            <span>Cierre</span>
            <span>Estado</span>
            <span className="text-right">Acción</span>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredVacantes.map((vacante) => (
              <div
                key={vacante.id}
                className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_0.8fr_0.8fr_170px] gap-4 px-5 py-4 items-center"
              >
                <div>
                  <p className="font-black text-slate-900">{vacante.titulo}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-500 mt-1">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={14} />
                      {vacante.modalidad}
                    </span>
                    <span>{vacante.ubicacion || "Sin ubicación"}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {vacante.areaNombre}
                  </p>
                </div>

                <div>
                  <p className="inline-flex items-center gap-1 text-sm text-slate-600">
                    <Calendar size={15} />
                    {formatDate(vacante.fechaCierre)}
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                      vacante.estado
                    )}`}
                  >
                    {getEstadoVisible(vacante.estado)}
                  </span>
                </div>

                <div className="flex justify-start lg:justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedVacante(vacante)}
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
            ))}
          </div>
        </section>
      )}

      {selectedVacante && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center px-4 py-8">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Detalle de vacante
                </h2>
                <p className="text-sm text-slate-500">
                  {selectedVacante.areaNombre}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedVacante(null)}
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
                    {getEstadoVisible(selectedVacante.estado)}
                  </span>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">Modalidad</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedVacante.modalidad}
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
                    {selectedVacante.nivelExperiencia}
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

              <section>
                <h3 className="font-black text-slate-900 mb-3">
                  Habilidades requeridas
                </h3>

                {selectedVacante.habilidades?.length === 0 ? (
                  <div className="border border-slate-200 rounded-xl p-4 text-slate-500">
                    No hay habilidades registradas.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedVacante.habilidades?.map((item) => (
                      <div
                        key={item.id}
                        className="border border-slate-200 rounded-xl p-4"
                      >
                        <p className="font-black text-slate-900">
                          {item.habilidadNombre}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          Nivel requerido: {item.nivelRequerido}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.obligatorio ? "Obligatoria" : "Deseable"}
                        </p>
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

export default RrhhJobs;