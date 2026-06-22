import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpenCheck,
  Briefcase,
  ClipboardList,
  FileBarChart,
  Home,
  Layers,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  UserCog,
  UserRound,
  Users,
  X,
  LockKeyhole,
  Building2,
  Trophy,
} from "lucide-react";
import { useState } from "react";

import { useAuth } from "../../context/AuthContext.jsx";
import { getHomeByRole } from "../../utils/roleRedirect.js";

const roleLabels = {
  ADMINISTRADOR: "Administrador",
  RECURSOS_HUMANOS: "Recursos Humanos",
  LIDER_TECNICO: "Líder Técnico",
  POSTULANTE: "Postulante",
};

const menuByRole = {
  POSTULANTE: [
    {
      label: "Dashboard",
      path: "/applicant/dashboard",
      icon: Home,
    },
    {
      label: "Vacantes",
      path: "/applicant/vacantes",
      icon: Briefcase,
    },
    {
      label: "Mis postulaciones",
      path: "/applicant/postulaciones",
      icon: ClipboardList,
    },
    {
      label: "Evaluaciones",
      path: "/applicant/evaluaciones",
      icon: BookOpenCheck,
    },
    {
      label: "Notificaciones",
      path: "/applicant/notificaciones",
      icon: Bell,
    },
    {
      label: "Mi perfil",
      path: "/applicant/perfil",
      icon: UserRound,
    },
  ],

  RECURSOS_HUMANOS: [
    {
      label: "Dashboard",
      path: "/rrhh/dashboard",
      icon: Home,
    },
    {
      label: "Vacantes",
      path: "/rrhh/vacantes",
      icon: Briefcase,
    },
    {
      label: "Crear vacante",
      path: "/rrhh/vacantes/create",
      icon: Layers,
    },
    {
      label: "Postulaciones",
      path: "/rrhh/postulaciones",
      icon: ClipboardList,
    },
    {
      label: "Candidatos",
      path: "/rrhh/candidatos",
      icon: Users,
    },
    {
      label: "Entrevistas",
      path: "/rrhh/entrevistas",
      icon: Bell,
    },
  ],

  LIDER_TECNICO: [
    {
      label: "Dashboard",
      path: "/technical/dashboard",
      icon: Home,
    },
    {
      label: "Procesos técnicos",
      path: "/technical/vacantes",
      icon: Briefcase,
    },
    {
      label: "Evaluaciones",
      path: "/technical/evaluaciones",
      icon: BookOpenCheck,
    },
    {
      label: "Crear evaluación",
      path: "/technical/evaluaciones/create",
      icon: Layers,
    },
    {
      label: "Resultados",
      path: "/technical/resultados",
      icon: Trophy,
    },
  ],

  ADMINISTRADOR: [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: Home,
    },
    {
      label: "Usuarios",
      path: "/admin/usuarios",
      icon: UserCog,
    },
    {
      label: "Crear usuario",
      path: "/admin/usuarios/create",
      icon: Users,
    },
    {
      label: "Áreas",
      path: "/admin/areas",
      icon: Building2,
    },
    {
      label: "Reportes",
      path: "/admin/reportes",
      icon: FileBarChart,
    },
    {
      label: "Configuración",
      path: "/admin/configuracion",
      icon: Settings,
    },
  ],
};

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const roleName = currentUser?.rolNombre;
  const menuItems = menuByRole[roleName] || [];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleGoHome = () => {
    navigate(getHomeByRole(roleName), { replace: true });
  };

  const getPageTitle = () => {
    const currentItem = menuItems.find((item) =>
      location.pathname.startsWith(item.path)
    );

    return currentItem?.label || "NovaRecruit";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Mobile topbar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-700"
        >
          <Menu size={22} />
        </button>

        <div className="text-center">
          <p className="font-black text-slate-900">NovaRecruit</p>
          <p className="text-xs text-slate-500">{getPageTitle()}</p>
        </div>

        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 text-white flex items-center justify-center font-black">
          {currentUser?.nombreCompleto?.charAt(0) || "U"}
        </div>
      </div>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
          aria-label="Cerrar menú"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-80 bg-white border-r border-slate-200 shadow-xl lg:shadow-none transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Brand */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleGoHome}
                className="flex items-center gap-3 text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <ShieldCheck size={25} />
                </div>

                <div>
                  <p className="text-xl font-black text-slate-900">
                    NovaRecruit
                  </p>
                  <p className="text-xs font-bold text-slate-500">
                    Sistema de reclutamiento
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* User card */}
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-sky-50 border border-emerald-100 p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-100 text-emerald-700 flex items-center justify-center font-black shrink-0">
                  {currentUser?.nombreCompleto?.charAt(0)?.toUpperCase() ||
                    "U"}
                </div>

                <div className="min-w-0">
                  <p className="font-black text-slate-900 truncate">
                    {currentUser?.nombreCompleto || "Usuario"}
                  </p>

                  <p className="text-xs text-slate-500 truncate">
                    {currentUser?.correo || "correo no disponible"}
                  </p>

                  <span className="inline-flex mt-2 px-3 py-1 rounded-full bg-white text-emerald-700 border border-emerald-100 text-xs font-black">
                    {roleLabels[roleName] || roleName || "Rol no definido"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto px-4 py-5">
            {menuItems.length === 0 ? (
              <div className="rounded-3xl bg-rose-50 border border-rose-100 p-4 text-rose-700 text-sm font-semibold">
                No hay opciones disponibles para este rol. Revisa que el usuario
                tenga un rol válido.
              </div>
            ) : (
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-lg shadow-emerald-500/20"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`
                      }
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </nav>

          {/* Footer actions */}
          <div className="p-4 border-t border-slate-100 space-y-2">
            <NavLink
              to="/change-password"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <LockKeyhole size={20} />
              Cambiar contraseña
            </NavLink>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-rose-600 hover:bg-rose-50"
            >
              <LogOut size={20} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:pl-80 min-h-screen">
        <header className="hidden lg:flex sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200 px-8 py-4 items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500">Panel</p>
            <h1 className="text-2xl font-black text-slate-900">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-black text-slate-900">
                {currentUser?.nombreCompleto || "Usuario"}
              </p>
              <p className="text-xs text-slate-500">
                {roleLabels[roleName] || roleName || "Rol"}
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500 text-white flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
              {currentUser?.nombreCompleto?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        <section className="p-5 md:p-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;