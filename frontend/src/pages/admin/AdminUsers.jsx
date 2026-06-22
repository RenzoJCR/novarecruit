import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Users,
  Mail,
  ShieldCheck,
  Calendar,
  RefreshCw,
  Trash2,
  Activity,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { userService } from "../../services/userService.js";
import { logService } from "../../services/logService.js";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("Todos");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        user.nombreCompleto?.toLowerCase().includes(value) ||
        user.correo?.toLowerCase().includes(value);

      const matchesRole =
        selectedRole === "Todos" || user.rolNombre === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [users, search, selectedRole]);

  const roleOptions = useMemo(() => {
    const roles = users.map((user) => user.rolNombre).filter(Boolean);
    return ["Todos", ...new Set(roles)];
  }, [users]);

  const activeUsersCount = users.filter((user) => user.estado).length;

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      showMessage(error.userMessage || "No se pudieron cargar los usuarios.", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadLogs = async () => {
    try {
      setLoadingLogs(true);
      const data = await logService.getLatest();
      const userLogs = data.filter((log) => log.modulo === "USUARIOS").slice(0, 5);
      setLogs(userLogs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const refreshData = async () => {
    await Promise.all([loadUsers(), loadLogs()]);
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

  const handleDeactivate = async (user) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas desactivar al usuario "${user.nombreCompleto}"?`
    );

    if (!confirmed) return;

    try {
      await userService.deactivate(user.id);
      showMessage("Usuario desactivado correctamente.", "success");
      await refreshData();
    } catch (error) {
      showMessage(error.userMessage || "No se pudo desactivar el usuario.", "error");
    }
  };

  const formatDate = (value) => {
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

  const statusClass = (estado) => {
    return estado
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-slate-50 text-slate-500 border-slate-200";
  };

  return (
    <div>
      <SectionHeader
        title="Gestión de usuarios"
        description="Administra usuarios internos y postulantes registrados en NovaRecruit."
        action={
          <button
            onClick={() => navigate("/admin/usuarios/create")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white px-5 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20"
          >
            <Plus size={18} />
            Crear usuario
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
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Usuarios</p>
          <p className="text-4xl font-black text-slate-900 mt-2">
            {users.length}
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Activos</p>
          <p className="text-4xl font-black text-emerald-600 mt-2">
            {activeUsersCount}
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Resultados</p>
          <p className="text-4xl font-black text-sky-600 mt-2">
            {filteredUsers.length}
          </p>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-5 mb-8 grid grid-cols-1 md:grid-cols-[1fr_240px_auto] gap-4 shadow-sm">
        <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
          <Search size={18} className="text-emerald-600" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-slate-900"
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="input-light"
        >
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role === "Todos" ? "Todos los roles" : role}
            </option>
          ))}
        </select>

        <button
          onClick={refreshData}
          className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-2xl font-black"
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      <section className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 text-sm font-black text-slate-600 border-b border-slate-200">
          <div className="col-span-3">Usuario</div>
          <div className="col-span-3">Correo</div>
          <div className="col-span-2">Rol</div>
          <div className="col-span-2">Registro</div>
          <div className="col-span-1">Estado</div>
          <div className="col-span-1 text-right">Acción</div>
        </div>

        {loadingUsers ? (
          <div className="p-10 text-center">
            <h3 className="text-2xl font-black text-slate-900">
              Cargando usuarios...
            </h3>
            <p className="text-slate-500 mt-2">
              Consultando información desde el backend.
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-2xl font-black text-slate-900">
              No se encontraron usuarios
            </h3>
            <p className="text-slate-500 mt-2">
              Prueba con otra búsqueda o cambia el filtro de rol.
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <article
              key={user.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-5 border-b border-slate-100 last:border-b-0 items-center hover:bg-slate-50/70 transition-colors"
            >
              <div className="lg:col-span-3 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center">
                  <Users size={21} />
                </div>

                <div>
                  <p className="font-black text-slate-900">
                    {user.nombreCompleto}
                  </p>
                  <p className="lg:hidden text-sm text-slate-500">
                    {user.rolNombre}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-3 flex items-center gap-2 text-slate-600 text-sm">
                <Mail size={16} className="text-emerald-600" />
                {user.correo}
              </div>

              <div className="lg:col-span-2 hidden lg:flex items-center gap-2 text-slate-600 text-sm">
                <ShieldCheck size={16} className="text-emerald-600" />
                {user.rolNombre}
              </div>

              <div className="lg:col-span-2 flex items-center gap-2 text-slate-600 text-sm">
                <Calendar size={16} className="text-emerald-600" />
                {formatDate(user.fechaRegistro)}
              </div>

              <div className="lg:col-span-1">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-black border ${statusClass(
                    user.estado
                  )}`}
                >
                  {user.estado ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="lg:col-span-1 flex lg:justify-end">
                {user.estado && (
                  <button
                    onClick={() => handleDeactivate(user)}
                    className="inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 px-3 py-2 rounded-xl font-black text-sm"
                  >
                    <Trash2 size={16} />
                    <span className="lg:hidden">Desactivar</span>
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </section>

      <section className="mt-8 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center">
            <Activity size={24} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900">
              Actividad reciente de usuarios
            </h2>
            <p className="text-sm text-slate-500">
              Últimos registros generados desde el backend.
            </p>
          </div>
        </div>

        {loadingLogs ? (
          <p className="text-slate-500">Cargando logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-slate-500">No hay logs recientes de usuarios.</p>
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
                    {formatDate(log.fechaHora)}
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

export default AdminUsers;