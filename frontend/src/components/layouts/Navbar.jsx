import { Bell, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

function Navbar() {
  const { currentUser, loginAs } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Panel de {currentUser?.roleLabel}
        </h2>
        <p className="text-sm text-slate-500">
          Bienvenido, {currentUser?.name}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
          <Search size={18} className="text-slate-500" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent outline-none text-sm text-slate-700"
          />
        </div>

        <button className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        <select
          value={currentUser?.role}
          onChange={(e) => loginAs(e.target.value)}
          className="border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none text-slate-700"
        >
          <option value="postulante">Postulante</option>
          <option value="rrhh">RRHH</option>
          <option value="tecnico">Líder Técnico</option>
          <option value="administrador">Administrador</option>
        </select>
      </div>
    </header>
  );
}

export default Navbar;