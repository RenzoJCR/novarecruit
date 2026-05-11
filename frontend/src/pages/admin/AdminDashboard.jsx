import { Briefcase, Users, Building2, BarChart3 } from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useData } from "../../context/DataContext.jsx";

function AdminDashboard() {
  const { jobs, applications, evaluations, systemUsers, areas } = useData();

  return (
    <div>
      <SectionHeader
        title="Dashboard administrador"
        description="Vista general del sistema NovaRecruit y sus principales indicadores."
      />

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
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Últimos usuarios
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Usuarios registrados o creados recientemente.
          </p>

          <div className="mt-5 space-y-4">
            {systemUsers.slice(0, 4).map((user) => (
              <div
                key={user.id}
                className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-slate-900">{user.name}</h3>
                  <p className="text-sm text-slate-500">
                    {user.email} · {user.role}
                  </p>
                </div>

                <StatusBadge status={user.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Estado de postulaciones
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Distribución general de procesos de selección.
          </p>

          <div className="mt-5 space-y-4">
            {applications.slice(0, 4).map((application) => (
              <div
                key={application.id}
                className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-slate-900">
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
    </div>
  );
}

export default AdminDashboard;