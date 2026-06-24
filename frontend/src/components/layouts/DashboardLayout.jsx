import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpenCheck,
  BrainCircuit,
  Briefcase,
  FileBarChart,
  Layers,
  LogOut,
  Menu,
  ShieldCheck,
  UserCog,
  UserRound,
  Users,
  X,
  LockKeyhole,
  Building2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext.jsx";
import { getHomeByRole } from "../../utils/roleRedirect.js";
import { websocketService } from "../../services/websocketService.js";

const roleLabels = {
  ADMINISTRADOR: "Administrador",
  RECURSOS_HUMANOS: "Recursos Humanos",
  LIDER_TECNICO: "Líder Técnico",
  POSTULANTE: "Postulante",
};

const roleStyles = {
  ADMINISTRADOR: {
    avatar: "bg-rose-600 text-white",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    active: "bg-rose-600 text-white",
    hover: "hover:bg-rose-50 hover:text-rose-700",
  },
  RECURSOS_HUMANOS: {
    avatar: "bg-amber-600 text-white",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    active: "bg-amber-600 text-white",
    hover: "hover:bg-amber-50 hover:text-amber-700",
  },
  LIDER_TECNICO: {
    avatar: "bg-emerald-600 text-white",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    active: "bg-emerald-600 text-white",
    hover: "hover:bg-emerald-50 hover:text-emerald-700",
  },
  POSTULANTE: {
    avatar: "bg-sky-600 text-white",
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    active: "bg-sky-600 text-white",
    hover: "hover:bg-sky-50 hover:text-sky-700",
  },
};

const menuByRole = {
  POSTULANTE: [
    {
      label: "Vacantes",
      path: "/applicant/vacantes",
      icon: Briefcase,
    },
    {
      label: "Mis postulaciones",
      path: "/applicant/postulaciones",
      icon: BookOpenCheck,
    },
    {
      label: "Mis evaluaciones",
      path: "/applicant/evaluaciones",
      icon: BookOpenCheck,
    },
    {
      label: "Notificaciones",
      path: "/notificaciones",
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
      label: "Notificaciones",
      path: "/notificaciones",
      icon: Bell,
    },
  ],

  LIDER_TECNICO: [
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
      label: "Notificaciones",
      path: "/notificaciones",
      icon: Bell,
    },
  ],

  ADMINISTRADOR: [
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
      label: "Habilidades",
      path: "/admin/habilidades",
      icon: BrainCircuit,
    },
    {
      label: "Logs del sistema",
      path: "/admin/reportes",
      icon: FileBarChart,
    },
    {
      label: "Notificaciones",
      path: "/notificaciones",
      icon: Bell,
    },
  ],
};

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [realtimeNotification, setRealtimeNotification] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  const roleName = currentUser?.rolNombre;
  const menuItems = menuByRole[roleName] || [];
  const styles = roleStyles[roleName] || roleStyles.POSTULANTE;

  useEffect(() => {
    if (!currentUser?.id) return undefined;

    const client = websocketService.connectToNotifications(
      currentUser.id,
      (notification) => {
        setRealtimeNotification(notification);

        if (location.pathname !== "/notificaciones") {
          setNotificationCount((prev) => prev + 1);
        }

        window.dispatchEvent(
          new CustomEvent("novarecruit:notification-received", {
            detail: notification,
          })
        );

        setTimeout(() => {
          setRealtimeNotification(null);
        }, 6000);
      }
    );

    return () => {
      websocketService.disconnect(client);
    };
  }, [currentUser?.id, location.pathname]);

  useEffect(() => {
    if (location.pathname === "/notificaciones") {
      setNotificationCount(0);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleGoHome = () => {
    navigate(getHomeByRole(roleName), { replace: true });
  };

  const handleNotificationClick = () => {
    setNotificationCount(0);
    setRealtimeNotification(null);
    navigate("/notificaciones");
  };

  const getPageTitle = () => {
    const currentItem = [...menuItems]
      .sort((a, b) => b.path.length - a.path.length)
      .find((item) => location.pathname.startsWith(item.path));

    return currentItem?.label || "NovaRecruit";
  };

  const userInitial =
    currentUser?.nombreCompleto?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700"
        >
          <Menu size={22} />
        </button>

        <div className="text-center">
          <p className="font-black text-slate-900">NovaRecruit</p>
          <p className="text-xs text-slate-500">{getPageTitle()}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNotificationClick}
            className="relative w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700"
          >
            <Bell size={20} />

            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-black ${styles.avatar}`}
          >
            {userInitial}
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
          aria-label="Cerrar menú"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-80 bg-white border-r border-slate-200 shadow-xl lg:shadow-none transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleGoHome}
                className="flex items-center gap-3 text-left"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${styles.avatar}`}
                >
                  <ShieldCheck size={23} />
                </div>

                <div>
                  <p className="text-xl font-black text-slate-900">
                    NovaRecruit
                  </p>
                  <p className="text-xs font-bold text-slate-500">
                    Reclutamiento TI
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

          <div className="px-5 py-4 border-b border-slate-100">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-black shrink-0 ${styles.avatar}`}
                >
                  {userInitial}
                </div>

                <div className="min-w-0">
                  <p className="font-black text-slate-900 truncate">
                    {currentUser?.nombreCompleto || "Usuario"}
                  </p>

                  <p className="text-xs text-slate-500 truncate">
                    {currentUser?.correo || "correo no disponible"}
                  </p>

                  <span
                    className={`inline-flex mt-2 px-3 py-1 rounded-full border text-xs font-black ${styles.badge}`}
                  >
                    {roleLabels[roleName] || roleName || "Rol no definido"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-5">
            {menuItems.length === 0 ? (
              <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4 text-rose-700 text-sm font-semibold">
                No hay opciones disponibles para este rol.
              </div>
            ) : (
              <div className="space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                          isActive
                            ? styles.active
                            : `text-slate-600 hover:bg-slate-50 ${styles.hover}`
                        }`
                      }
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>

                      {item.path === "/notificaciones" &&
                        notificationCount > 0 && (
                          <span className="ml-auto min-w-5 h-5 px-1 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center">
                            {notificationCount}
                          </span>
                        )}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </nav>

          <div className="p-4 border-t border-slate-100 space-y-2">
            <NavLink
              to="/change-password"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <LockKeyhole size={20} />
              Cambiar contraseña
            </NavLink>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-rose-600 hover:bg-rose-50"
            >
              <LogOut size={20} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <main className="lg:pl-80 min-h-screen">
        <header className="hidden lg:flex sticky top-0 z-30 bg-white border-b border-slate-200 px-8 py-4 items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500">Panel</p>
            <h1 className="text-2xl font-black text-slate-900">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleNotificationClick}
              className="relative w-11 h-11 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700"
              title="Notificaciones"
            >
              <Bell size={20} />

              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            <div className="text-right">
              <p className="font-black text-slate-900">
                {currentUser?.nombreCompleto || "Usuario"}
              </p>
              <p className="text-xs text-slate-500">
                {roleLabels[roleName] || roleName || "Rol"}
              </p>
            </div>

            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-black ${styles.avatar}`}
            >
              {userInitial}
            </div>
          </div>
        </header>

        <section className="p-5 md:p-8 bg-slate-100 min-h-[calc(100vh-73px)]">
          <Outlet />
        </section>
      </main>

      {realtimeNotification && (
        <button
          type="button"
          onClick={handleNotificationClick}
          className="fixed right-5 bottom-5 z-[60] w-[calc(100%-2.5rem)] sm:w-96 text-left bg-white border border-slate-200 shadow-xl rounded-2xl p-4 hover:bg-slate-50"
        >
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <Bell size={20} />
            </div>

            <div className="min-w-0">
              <p className="font-black text-slate-900">
                {realtimeNotification.titulo}
              </p>
              <p className="text-sm text-slate-600 mt-1">
                {realtimeNotification.mensaje}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Recibido en tiempo real por WebSocket/STOMP
              </p>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

export default DashboardLayout;