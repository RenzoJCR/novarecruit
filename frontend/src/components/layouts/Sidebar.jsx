import { NavLink } from "react-router-dom";
import { navigationByRole } from "../../data/navigation.js";
import { useAuth } from "../../context/AuthContext.jsx";

function Sidebar() {
  const { currentUser } = useAuth();

  const menuItems = navigationByRole[currentUser?.role] || [];

  return (
    <aside className="hidden lg:flex w-72 min-h-screen bg-slate-950 text-white border-r border-slate-800 flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">
          Nova<span className="text-blue-500">Recruit</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Sistema de reclutamiento TI
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <p className="text-sm text-slate-400">Rol actual</p>
        <p className="font-semibold">{currentUser?.roleLabel}</p>
      </div>
    </aside>
  );
}

export default Sidebar;