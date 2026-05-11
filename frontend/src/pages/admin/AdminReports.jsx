import { BarChart3, Briefcase, ClipboardList, Users } from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useData } from "../../context/DataContext.jsx";

function AdminReports() {
  const { jobs, applications, evaluations, systemUsers } = useData();

  const approved = applications.filter((item) =>
    ["APROBADO_RRHH", "APROBADO_TECNICO", "SELECCIONADO"].includes(item.status)
  );

  const rejected = applications.filter((item) =>
    ["RECHAZADO_RRHH", "RECHAZADO_TECNICO", "RECHAZADO_FINAL"].includes(
      item.status
    )
  );

  return (
    <div>
      <SectionHeader
        title="Reportes generales"
        description="Indicadores globales del sistema de reclutamiento NovaRecruit."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Vacantes"
          value={jobs.length}
          description="Total publicadas"
          icon={Briefcase}
        />

        <StatCard
          title="Postulaciones"
          value={applications.length}
          description="Procesos registrados"
          icon={Users}
        />

        <StatCard
          title="Evaluaciones"
          value={evaluations.length}
          description="Pruebas técnicas"
          icon={ClipboardList}
        />

        <StatCard
          title="Usuarios"
          value={systemUsers.length}
          description="Cuentas registradas"
          icon={BarChart3}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Resumen de resultados
          </h2>

          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-slate-700">
                  Aprobados
                </span>
                <span className="text-slate-500">{approved.length}</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${Math.min(approved.length * 25, 100)}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-slate-700">
                  Rechazados
                </span>
                <span className="text-slate-500">{rejected.length}</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{
                    width: `${Math.min(rejected.length * 25, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Últimas postulaciones
          </h2>

          <div className="mt-5 space-y-4">
            {applications.slice(0, 5).map((application) => (
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

export default AdminReports;