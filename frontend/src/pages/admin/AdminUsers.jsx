import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Users, Mail, ShieldCheck, Calendar } from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useData } from "../../context/DataContext.jsx";

function AdminUsers() {
  const navigate = useNavigate();
  const { systemUsers } = useData();

  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("Todos");

  const filteredUsers = useMemo(() => {
    return systemUsers.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        selectedRole === "Todos" || user.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [systemUsers, search, selectedRole]);

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Usuarios</p>
          <p className="text-4xl font-black text-slate-900 mt-2">
            {systemUsers.length}
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Activos</p>
          <p className="text-4xl font-black text-emerald-600 mt-2">
            {systemUsers.filter((user) => user.status === "Activo").length}
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Resultados</p>
          <p className="text-4xl font-black text-sky-600 mt-2">
            {filteredUsers.length}
          </p>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-5 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
        <div className="md:col-span-2 flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
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
          <option value="Todos">Todos los roles</option>
          <option value="ADMINISTRADOR">Administrador</option>
          <option value="RECURSOS_HUMANOS">Recursos Humanos</option>
          <option value="LIDER_TECNICO">Líder Técnico</option>
          <option value="POSTULANTE">Postulante</option>
        </select>
      </div>

      <section className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 text-sm font-black text-slate-600 border-b border-slate-200">
          <div className="col-span-3">Usuario</div>
          <div className="col-span-3">Correo</div>
          <div className="col-span-2">Rol</div>
          <div className="col-span-2">Fecha</div>
          <div className="col-span-2">Estado</div>
        </div>

        {filteredUsers.length === 0 ? (
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
                  <p className="font-black text-slate-900">{user.name}</p>
                  <p className="lg:hidden text-sm text-slate-500">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-3 flex items-center gap-2 text-slate-600 text-sm">
                <Mail size={16} className="text-emerald-600" />
                {user.email}
              </div>

              <div className="lg:col-span-2 hidden lg:flex items-center gap-2 text-slate-600 text-sm">
                <ShieldCheck size={16} className="text-emerald-600" />
                {user.role}
              </div>

              <div className="lg:col-span-2 flex items-center gap-2 text-slate-600 text-sm">
                <Calendar size={16} className="text-emerald-600" />
                {user.createdAt}
              </div>

              <div className="lg:col-span-2">
                <StatusBadge status={user.status} />
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

export default AdminUsers;