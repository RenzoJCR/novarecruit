import { Bell, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";

function Navbar() {
  const navigate = useNavigate();
  const { currentUser, loginAs, logout } = useAuth();
  const { notifications } = useData();

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  );

  const handleRoleChange = (role) => {
    loginAs(role);

    const routes = {
      postulante: "/applicant/dashboard",
      rrhh: "/rrhh/dashboard",
      tecnico: "/technical/dashboard",
      administrador: "/admin/dashboard",
    };

    navigate(routes[role]);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <div>
        <h2 className="text-xl font-black text-slate-900">
          Panel de {currentUser?.roleLabel || "usuario"}
        </h2>

        <p className="text-sm text-slate-500">
          Bienvenido, {currentUser?.name || "selecciona un rol"}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200">
          <Search size={18} className="text-slate-500" />

          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent outline-none text-sm text-slate-700"
          />
        </div>

        <button
          onClick={() => navigate("/applicant/notificaciones")}
          className="relative p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100"
        >
          <Bell size={20} />

          {unreadNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
              {unreadNotifications.length}
            </span>
          )}
        </button>

        <select
          value={currentUser?.role || "postulante"}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="hidden md:block border border-slate-300 rounded-2xl px-3 py-2 text-sm outline-none text-slate-700 bg-white focus:border-emerald-500"
        >
          <option value="postulante">Postulante</option>
          <option value="rrhh">RRHH</option>
          <option value="tecnico">Líder Técnico</option>
          <option value="administrador">Administrador</option>
        </select>

        <button
          onClick={handleLogout}
          className="hidden md:inline-flex items-center gap-2 border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-2xl font-semibold"
        >
          <LogOut size={17} />
          Salir
        </button>
      </div>
    </header>
  );
}

export default Navbar;