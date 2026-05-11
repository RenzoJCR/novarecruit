import { NavLink } from "react-router-dom";
import { navigationByRole } from "../../data/navigation.js";
import { useAuth } from "../../context/AuthContext.jsx";

function Sidebar() {
  const { currentUser } = useAuth();

  const menuItems = navigationByRole[currentUser?.role] || [];

  return (
    <aside className="hidden lg:flex w-72 min-h-screen bg-slate-950 text-white border-r border-slate-800 flex-col relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-0 w-60 h-60 bg-sky-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 p-6 border-b border-white/10">
        <h1 className="text-2xl font-black tracking-tight">
          Nova<span className="gradient-text">Recruit</span>
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Gestión de talento TI
        </p>
      </div>

      <nav className="relative z-10 flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  isActive
                    ? "bg-emerald-400/15 text-emerald-200 border border-emerald-300/20 shadow-lg shadow-emerald-500/10"
                    : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                }`
              }
            >
              <Icon size={20} />
              <span className="font-semibold">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="relative z-10 p-4 border-t border-white/10">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <p className="text-xs text-slate-400 uppercase tracking-wide">
            Sesión actual
          </p>

          <p className="font-bold mt-1">{currentUser?.name || "Sin sesión"}</p>

          <p className="text-sm text-emerald-300 mt-1">
            {currentUser?.roleLabel || "Demo"}
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;