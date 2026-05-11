import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";

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
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
          >
            <Plus size={18} />
            Crear usuario
          </button>
        }
      />

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 flex items-center gap-3 border border-slate-300 rounded-xl px-4 py-3">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none"
          />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="Todos">Todos los roles</option>
          <option value="ADMINISTRADOR">Administrador</option>
          <option value="RECURSOS_HUMANOS">Recursos Humanos</option>
          <option value="LIDER_TECNICO">Líder Técnico</option>
          <option value="POSTULANTE">Postulante</option>
        </select>
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 text-sm font-bold text-slate-600">
          <div className="col-span-4">Usuario</div>
          <div className="col-span-3">Correo</div>
          <div className="col-span-2">Rol</div>
          <div className="col-span-2">Fecha</div>
          <div className="col-span-1">Estado</div>
        </div>

        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-12 gap-4 px-6 py-4 border-t border-slate-100 items-center"
          >
            <div className="col-span-4">
              <p className="font-bold text-slate-900">{user.name}</p>
            </div>

            <div className="col-span-3 text-slate-600 text-sm">
              {user.email}
            </div>

            <div className="col-span-2 text-slate-600 text-sm">
              {user.role}
            </div>

            <div className="col-span-2 text-slate-600 text-sm">
              {user.createdAt}
            </div>

            <div className="col-span-1">
              <StatusBadge status={user.status} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default AdminUsers;