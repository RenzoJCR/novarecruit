import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Mail,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  X,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { userService } from "../../services/userService.js";

function getRolVisible(rol) {
  const labels = {
    ADMINISTRADOR: "Administrador",
    RECURSOS_HUMANOS: "RRHH",
    LIDER_TECNICO: "Líder técnico",
    POSTULANTE: "Postulante",
  };

  return labels[rol] || rol || "Sin rol";
}

function rolClass(rol) {
  const styles = {
    ADMINISTRADOR: "bg-rose-50 text-rose-700 border-rose-200",
    RECURSOS_HUMANOS: "bg-amber-50 text-amber-700 border-amber-200",
    LIDER_TECNICO: "bg-emerald-50 text-emerald-700 border-emerald-200",
    POSTULANTE: "bg-sky-50 text-sky-700 border-sky-200",
  };

  return styles[rol] || "bg-slate-50 text-slate-700 border-slate-200";
}

function getEstadoVisible(estado) {
  if (estado === true || estado === "ACTIVO") return "Activo";
  if (estado === false || estado === "INACTIVO") return "Inactivo";
  return "Sin estado";
}

function estadoClass(estado) {
  if (estado === true || estado === "ACTIVO") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  return "bg-slate-50 text-slate-600 border-slate-200";
}

function getNombreCompleto(usuario) {
  if (usuario.nombreCompleto) return usuario.nombreCompleto;

  const nombres = usuario.nombres || "";
  const apellidos = usuario.apellidos || "";

  return `${nombres} ${apellidos}`.trim() || "Usuario";
}

function getEstadoValue(usuario) {
  if (usuario.estado !== undefined) return usuario.estado;
  if (usuario.activo !== undefined) return usuario.activo;
  return true;
}

function AdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  const [loading, setLoading] = useState(true);
  const [deactivatingId, setDeactivatingId] = useState(null);
  const [reactivatingId, setReactivatingId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const loadUsuarios = async () => {
    try {
      setLoading(true);

      const data = await userService.getAll();
      setUsuarios(data);

      if (selectedUser) {
        const updated = data.find((item) => item.id === selectedUser.id);
        setSelectedUser(updated || null);
      }
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudieron cargar los usuarios.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const filteredUsuarios = useMemo(() => {
    const value = search.toLowerCase().trim();

    return usuarios.filter((usuario) => {
      const nombreCompleto = getNombreCompleto(usuario).toLowerCase();
      const correo = usuario.correo?.toLowerCase() || "";
      const rol = usuario.rolNombre || usuario.rol || "";
      const rolVisible = getRolVisible(rol).toLowerCase();
      const estado = getEstadoValue(usuario);
      const estadoVisible = getEstadoVisible(estado).toLowerCase();

      const matchesSearch =
        nombreCompleto.includes(value) ||
        correo.includes(value) ||
        rolVisible.includes(value) ||
        estadoVisible.includes(value);

      const matchesRole = selectedRole === "Todos" || rol === selectedRole;

      const matchesStatus =
        selectedStatus === "Todos" ||
        (selectedStatus === "Activos" &&
          (estado === true || estado === "ACTIVO")) ||
        (selectedStatus === "Inactivos" &&
          (estado === false || estado === "INACTIVO"));

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [usuarios, search, selectedRole, selectedStatus]);

  const totalActivos = usuarios.filter((item) => {
    const estado = getEstadoValue(item);
    return estado === true || estado === "ACTIVO";
  }).length;

  const totalInactivos = usuarios.filter((item) => {
    const estado = getEstadoValue(item);
    return estado === false || estado === "INACTIVO";
  }).length;

  const totalInternos = usuarios.filter((item) =>
    ["ADMINISTRADOR", "RECURSOS_HUMANOS", "LIDER_TECNICO"].includes(
      item.rolNombre || item.rol
    )
  ).length;

  const handleDeactivate = async (usuario) => {
    const confirmed = window.confirm(
      `¿Deseas inhabilitar al usuario "${getNombreCompleto(usuario)}"?`
    );

    if (!confirmed) return;

    try {
      setDeactivatingId(usuario.id);

      await userService.deactivate(usuario.id);

      showMessage("Usuario inhabilitado correctamente.", "success");
      await loadUsuarios();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo inhabilitar el usuario.",
        "error"
      );
    } finally {
      setDeactivatingId(null);
    }
  };

  const handleReactivate = async (usuario) => {
    const confirmed = window.confirm(
      `¿Deseas reactivar al usuario "${getNombreCompleto(usuario)}"?`
    );

    if (!confirmed) return;

    try {
      setReactivatingId(usuario.id);

      await userService.reactivate(usuario.id);

      showMessage("Usuario reactivado correctamente.", "success");
      await loadUsuarios();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo reactivar el usuario.",
        "error"
      );
    } finally {
      setReactivatingId(null);
    }
  };

  const canDeactivate = (usuario) => {
    const estado = getEstadoValue(usuario);
    return estado === true || estado === "ACTIVO";
  };

  const canReactivate = (usuario) => {
    const estado = getEstadoValue(usuario);
    return estado === false || estado === "INACTIVO";
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div>
      <SectionHeader
        title="Usuarios"
        description="Administra usuarios internos y postulantes registrados en el sistema."
        action={
          <Link
            to="/admin/usuarios/create"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-black"
          >
            <Plus size={17} />
            Nuevo usuario
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

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Total usuarios</p>
          <p className="text-3xl font-black text-rose-600 mt-1">
            {usuarios.length}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Activos</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">
            {totalActivos}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Inactivos</p>
          <p className="text-3xl font-black text-slate-700 mt-1">
            {totalInactivos}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">
            Usuarios internos
          </p>
          <p className="text-3xl font-black text-amber-600 mt-1">
            {totalInternos}
          </p>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-[1fr_190px_190px_auto] gap-3">
        <div className="flex items-center gap-3 border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100">
          <Search size={18} className="text-rose-600" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo, rol o estado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-sm text-slate-900"
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="input-light"
        >
          <option value="Todos">Todos los roles</option>
          <option value="ADMINISTRADOR">Administrador</option>
          <option value="RECURSOS_HUMANOS">RRHH</option>
          <option value="LIDER_TECNICO">Líder técnico</option>
          <option value="POSTULANTE">Postulante</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="input-light"
        >
          <option value="Todos">Todos</option>
          <option value="Activos">Activos</option>
          <option value="Inactivos">Inactivos</option>
        </select>

        <button
          type="button"
          onClick={loadUsuarios}
          className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-black"
        >
          <RefreshCw size={17} />
          Actualizar
        </button>
      </section>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-black text-slate-900">
            Cargando usuarios...
          </h2>
          <p className="text-slate-500 mt-1">Un momento por favor.</p>
        </div>
      ) : filteredUsuarios.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <UserCog size={36} className="mx-auto text-rose-600" />
          <h2 className="text-xl font-black text-slate-900 mt-3">
            No hay usuarios para mostrar
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Crea un nuevo usuario o ajusta los filtros.
          </p>
        </div>
      ) : (
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1.3fr_1fr_0.8fr_0.7fr_220px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase">
            <span>Usuario</span>
            <span>Correo</span>
            <span>Rol</span>
            <span>Estado</span>
            <span className="text-right">Acciones</span>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredUsuarios.map((usuario) => {
              const rol = usuario.rolNombre || usuario.rol;
              const estado = getEstadoValue(usuario);

              return (
                <div
                  key={usuario.id}
                  className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_0.8fr_0.7fr_220px] gap-4 px-5 py-4 items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 flex items-center justify-center font-black shrink-0">
                      {getNombreCompleto(usuario).charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-black text-slate-900">
                        {getNombreCompleto(usuario)}
                      </p>
                      <p className="text-xs text-slate-400">
                        ID: {usuario.id}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 break-all">
                      {usuario.correo}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${rolClass(
                        rol
                      )}`}
                    >
                      {getRolVisible(rol)}
                    </span>
                  </div>

                  <div>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${estadoClass(
                        estado
                      )}`}
                    >
                      {getEstadoVisible(estado)}
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-start lg:justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUser(usuario)}
                      className="inline-flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-sm font-bold"
                    >
                      <Eye size={16} />
                      Ver
                    </button>

                    {canDeactivate(usuario) && (
                      <button
                        type="button"
                        disabled={deactivatingId === usuario.id}
                        onClick={() => handleDeactivate(usuario)}
                        className="inline-flex items-center gap-1.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 disabled:bg-slate-100 text-rose-700 disabled:text-slate-500 px-3 py-2 rounded-xl text-sm font-bold"
                      >
                        <Trash2 size={16} />
                        Inhabilitar
                      </button>
                    )}

                    {canReactivate(usuario) && (
                      <button
                        type="button"
                        disabled={reactivatingId === usuario.id}
                        onClick={() => handleReactivate(usuario)}
                        className="inline-flex items-center gap-1.5 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 disabled:bg-slate-100 text-emerald-700 disabled:text-slate-500 px-3 py-2 rounded-xl text-sm font-bold"
                      >
                        <ShieldCheck size={16} />
                        Reactivar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center px-4 py-8">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Detalle de usuario
                </h2>
                <p className="text-sm text-slate-500">
                  {getNombreCompleto(selectedUser)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-9 h-9 rounded-xl border border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <section className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 flex items-center justify-center font-black shrink-0">
                    {getNombreCompleto(selectedUser).charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-lg font-black text-slate-900">
                      {getNombreCompleto(selectedUser)}
                    </p>

                    <p className="text-sm text-slate-500 inline-flex items-center gap-2 mt-1">
                      <Mail size={15} />
                      {selectedUser.correo}
                    </p>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">Rol</p>

                  <span
                    className={`inline-flex mt-2 px-3 py-1 rounded-full border text-xs font-black ${rolClass(
                      selectedUser.rolNombre || selectedUser.rol
                    )}`}
                  >
                    {getRolVisible(selectedUser.rolNombre || selectedUser.rol)}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">Estado</p>

                  <span
                    className={`inline-flex mt-2 px-3 py-1 rounded-full border text-xs font-black ${estadoClass(
                      getEstadoValue(selectedUser)
                    )}`}
                  >
                    {getEstadoVisible(getEstadoValue(selectedUser))}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">
                    Correo verificado
                  </p>

                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedUser.correoVerificado ? "Sí" : "No"}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-black text-slate-500">
                    Cambio de contraseña
                  </p>

                  <p className="text-sm font-bold text-slate-800 mt-1">
                    {selectedUser.debeCambiarPassword
                      ? "Pendiente"
                      : "No requerido"}
                  </p>
                </div>
              </section>

              <section className="border border-slate-200 bg-slate-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={20}
                    className="text-slate-500 shrink-0 mt-1"
                  />
                  <p className="text-sm text-slate-600">
                    Los usuarios no se eliminan definitivamente; se inhabilitan
                    y pueden reactivarse para mantener la trazabilidad del sistema.
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

export default AdminUsers;