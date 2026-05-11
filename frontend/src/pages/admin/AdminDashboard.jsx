import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  Building2,
  BarChart3,
  ArrowRight,
  UserPlus,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useData } from "../../context/DataContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { jobs, applications, evaluations, systemUsers, areas } = useData();

  return (
    <div>
      <SectionHeader
        title="Dashboard administrador"
        description="Vista general del sistema NovaRecruit y sus principales indicadores."
      />

      <section className="mb-8 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 rounded-[2rem] p-7 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-20 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-emerald-300 text-sm font-bold mb-5">
              <Sparkles size={16} />
              Administración general
            </span>

            <h2 className="text-3xl lg:text-4xl font-black">
              Hola, {currentUser?.name || "administrador"}
            </h2>

            <p className="text-slate-300 mt-3 max-w-2xl leading-relaxed">
              Desde aquí puedes supervisar usuarios, áreas, vacantes,
              evaluaciones, reportes y configuración general del sistema.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/admin/usuarios/create")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 px-5 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20"
              >
                <UserPlus size={18} />
                Crear usuario
              </button>

              <button
                onClick={() => navigate("/admin/areas")}
                className="inline-flex items-center gap-2 border border-white/15 hover:bg-white/10 px-5 py-3 rounded-2xl font-black"
              >
                <Plus size={18} />
                Crear área
              </button>

              <button
                onClick={() => navigate("/admin/reportes")}
                className="inline-flex items-center gap-2 border border-white/15 hover:bg-white/10 px-5 py-3 rounded-2xl font-black"
              >
                Ver reportes
              </button>
            </div>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
            <p className="text-sm text-slate-300 font-semibold">
              Estado del sistema
            </p>

            <h3 className="text-4xl font-black mt-2">Activo</h3>

            <p className="text-slate-300 text-sm mt-1">
              Simulación frontend conectada por contexto global.
            </p>

            <button
              onClick={() => navigate("/admin/configuracion")}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-white text-slate-950 hover:bg-emerald-100 py-3 rounded-2xl font-black"
            >
              <Settings size={18} />
              Configuración
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Usuarios"
          value={systemUsers.length}
          description="Registrados en el sistema"
          icon={Users}
        />

        <StatCard
          title="Áreas"
          value={areas.length}
          description="Áreas disponibles"
          icon={Building2}
        />

        <StatCard
          title="Vacantes"
          value={jobs.length}
          description="Publicaciones creadas"
          icon={Briefcase}
        />

        <StatCard
          title="Evaluaciones"
          value={evaluations.length}
          description="Pruebas técnicas"
          icon={BarChart3}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-white/95 border border-slate-200 rounded-[2rem] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Últimos usuarios
              </h2>
              <p className="text-slate-500 text-sm">
                Usuarios creados o registrados recientemente.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/usuarios")}
              className="hidden md:inline-flex items-center gap-2 text-emerald-600 font-black"
            >
              Ver usuarios
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="space-y-4">
            {systemUsers.slice(0, 4).map((user) => (
              <div
                key={user.id}
                className="border border-slate-200 rounded-3xl p-4 flex items-center justify-between gap-4 bg-slate-50"
              >
                <div>
                  <h3 className="font-black text-slate-900">{user.name}</h3>
                  <p className="text-sm text-slate-500">
                    {user.email} · {user.role}
                  </p>
                </div>

                <StatusBadge status={user.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/95 border border-slate-200 rounded-[2rem] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Estado de postulaciones
              </h2>
              <p className="text-slate-500 text-sm">
                Distribución general de procesos de selección.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/reportes")}
              className="hidden md:inline-flex items-center gap-2 text-emerald-600 font-black"
            >
              Reportes
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="space-y-4">
            {applications.slice(0, 4).map((application) => (
              <div
                key={application.id}
                className="border border-slate-200 rounded-3xl p-4 flex items-center justify-between gap-4 bg-slate-50"
              >
                <div>
                  <h3 className="font-black text-slate-900">
                    {application.candidate}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {application.jobTitle}
                  </p>
                </div>

                <StatusBadge status={application.status} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-8 bg-white/95 border border-slate-200 rounded-[2rem] p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-900">
          Accesos rápidos del administrador
        </h2>

        <p className="text-slate-500 text-sm mt-1">
          Acciones frecuentes para administrar NovaRecruit.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <button
            onClick={() => navigate("/admin/usuarios/create")}
            className="rounded-3xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 p-5 text-left transition-all"
          >
            <UserPlus className="text-emerald-600 mb-3" size={25} />
            <p className="font-black text-slate-900">Crear usuario</p>
            <p className="text-sm text-slate-500 mt-1">
              Registrar RRHH, técnico o admin.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/areas")}
            className="rounded-3xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 p-5 text-left transition-all"
          >
            <Building2 className="text-emerald-600 mb-3" size={25} />
            <p className="font-black text-slate-900">Gestionar áreas</p>
            <p className="text-sm text-slate-500 mt-1">
              Organizar vacantes por área.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/reportes")}
            className="rounded-3xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 p-5 text-left transition-all"
          >
            <BarChart3 className="text-emerald-600 mb-3" size={25} />
            <p className="font-black text-slate-900">Ver reportes</p>
            <p className="text-sm text-slate-500 mt-1">
              Indicadores de reclutamiento.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/configuracion")}
            className="rounded-3xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 p-5 text-left transition-all"
          >
            <Settings className="text-emerald-600 mb-3" size={25} />
            <p className="font-black text-slate-900">Configuración</p>
            <p className="text-sm text-slate-500 mt-1">
              Parámetros generales.
            </p>
          </button>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;