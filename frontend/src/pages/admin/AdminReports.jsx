import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Calendar,
  Eye,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { logSistemaService } from "../../services/logSistemaService.js";

function formatDateTime(value) {
  if (!value) return "Sin fecha";

  return new Date(value).toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "medium",
  });
}

function moduloClass(modulo) {
  const styles = {
    AUTH: "bg-sky-50 text-sky-700 border-sky-200",
    USUARIOS: "bg-rose-50 text-rose-700 border-rose-200",
    AREAS: "bg-violet-50 text-violet-700 border-violet-200",
    VACANTES: "bg-amber-50 text-amber-700 border-amber-200",
    POSTULACIONES: "bg-emerald-50 text-emerald-700 border-emerald-200",
    EVALUACIONES: "bg-indigo-50 text-indigo-700 border-indigo-200",
    NOTIFICACIONES: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return styles[modulo] || "bg-slate-50 text-slate-700 border-slate-200";
}

function AdminReports() {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedModule, setSelectedModule] = useState("Todos");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await logSistemaService.getAll();
      setLogs(data);
    } catch (error) {
      setMessage(error.userMessage || "No se pudieron cargar los logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const modules = useMemo(() => {
    const uniqueModules = new Set(
      logs.map((item) => item.modulo).filter(Boolean)
    );

    return ["Todos", ...Array.from(uniqueModules)];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const value = search.toLowerCase().trim();

    return logs.filter((log) => {
      const matchesSearch =
        log.usuarioNombre?.toLowerCase().includes(value) ||
        log.usuarioCorreo?.toLowerCase().includes(value) ||
        log.accion?.toLowerCase().includes(value) ||
        log.modulo?.toLowerCase().includes(value) ||
        log.descripcion?.toLowerCase().includes(value) ||
        log.ip?.toLowerCase().includes(value);

      const matchesModule =
        selectedModule === "Todos" || log.modulo === selectedModule;

      return matchesSearch && matchesModule;
    });
  }, [logs, search, selectedModule]);

  const totalHoy = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return logs.filter((log) => {
      if (!log.createdAt) return false;
      return String(log.createdAt).slice(0, 10) === today;
    }).length;
  }, [logs]);

  const totalUsuarios = useMemo(() => {
    const usuarios = new Set(
      logs.map((item) => item.usuarioId).filter(Boolean)
    );

    return usuarios.size;
  }, [logs]);

  return (
    <div>
      <SectionHeader
        title="Logs del sistema"
        description="Consulta las acciones realizadas por los usuarios dentro del sistema."
        action={
          <button
            type="button"
            onClick={loadLogs}
            className="inline-flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-black"
          >
            <RefreshCw size={17} />
            Actualizar
          </button>
        }
      />

      {message && (
        <div className="mb-5 border border-rose-200 bg-rose-50 text-rose-700 rounded-2xl px-4 py-3 text-sm font-semibold">
          {message}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Total logs</p>
          <p className="text-3xl font-black text-rose-600 mt-1">
            {logs.length}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Hoy</p>
          <p className="text-3xl font-black text-amber-600 mt-1">
            {totalHoy}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">
            Usuarios registrados en logs
          </p>
          <p className="text-3xl font-black text-slate-700 mt-1">
            {totalUsuarios}
          </p>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">
        <div className="flex items-center gap-3 border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100">
          <Search size={18} className="text-rose-600" />
          <input
            type="text"
            placeholder="Buscar por usuario, acción, módulo, descripción o IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-sm text-slate-900"
          />
        </div>

        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="input-light"
        >
          {modules.map((module) => (
            <option key={module} value={module}>
              {module}
            </option>
          ))}
        </select>
      </section>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-black text-slate-900">
            Cargando logs...
          </h2>
          <p className="text-slate-500 mt-1">Un momento por favor.</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <Activity size={36} className="mx-auto text-rose-600" />
          <h2 className="text-xl font-black text-slate-900 mt-3">
            No hay logs para mostrar
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Ajusta los filtros o registra nuevas acciones en el sistema.
          </p>
        </div>
      ) : (
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1.1fr_0.8fr_0.8fr_1.5fr_150px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase">
            <span>Usuario</span>
            <span>Módulo</span>
            <span>Acción</span>
            <span>Descripción</span>
            <span className="text-right">Acción</span>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1.5fr_150px] gap-4 px-5 py-4 items-center"
              >
                <div>
                  <p className="font-black text-slate-900">
                    {log.usuarioNombre || "Sistema"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {log.usuarioCorreo || "Sin correo"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 inline-flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDateTime(log.createdAt)}
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${moduloClass(
                      log.modulo
                    )}`}
                  >
                    {log.modulo || "GENERAL"}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-700">
                    {log.accion}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {log.descripcion}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    IP: {log.ip || "No registrada"}
                  </p>
                </div>

                <div className="flex justify-start lg:justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedLog(log)}
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

      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center px-4 py-8">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Detalle del log
                </h2>
                <p className="text-sm text-slate-500">
                  {formatDateTime(selectedLog.createdAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="w-9 h-9 rounded-xl border border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <section className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={22}
                    className="text-rose-600 shrink-0 mt-1"
                  />
                  <div>
                    <p className="text-xs font-black text-slate-500">
                      Acción registrada
                    </p>
                    <p className="text-lg font-black text-slate-900 mt-1">
                      {selectedLog.accion}
                    </p>
                    <p className="text-sm text-slate-600 mt-2">
                      {selectedLog.descripcion}
                    </p>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">Usuario</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedLog.usuarioNombre || "Sistema"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {selectedLog.usuarioCorreo || "Sin correo"}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">Módulo</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedLog.modulo || "GENERAL"}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">IP</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedLog.ip || "No registrada"}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">Fecha</p>
                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {formatDateTime(selectedLog.createdAt)}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReports;