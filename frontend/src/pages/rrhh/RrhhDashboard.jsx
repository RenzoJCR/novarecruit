import { Briefcase, Users, UserCheck, CalendarCheck } from "lucide-react";

import StatCard from "../../components/ui/StatCard.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import JobCard from "../../components/ui/JobCard.jsx";
import ApplicationCard from "../../components/ui/ApplicationCard.jsx";
import { useData } from "../../context/DataContext.jsx";

function RrhhDashboard() {
  const { jobs, applications } = useData();

  const activeJobs = jobs.filter((job) => job.status === "Activa");
  const pendingApplications = applications.filter(
    (application) => application.status === "POSTULADO"
  );
  const approvedByRrhh = applications.filter(
    (application) => application.status === "APROBADO_RRHH"
  );

  return (
    <div>
      <SectionHeader
        title="Dashboard de RRHH"
        description="Gestiona vacantes, postulaciones, candidatos y entrevistas del proceso de selección."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Vacantes activas"
          value={activeJobs.length}
          description="Publicaciones disponibles"
          icon={Briefcase}
        />

        <StatCard
          title="Postulaciones nuevas"
          value={pendingApplications.length}
          description="Pendientes de revisión"
          icon={Users}
        />

        <StatCard
          title="Aprobados RRHH"
          value={approvedByRrhh.length}
          description="Listos para evaluación técnica"
          icon={UserCheck}
        />

        <StatCard
          title="Entrevistas"
          value="2"
          description="Pendientes de programación"
          icon={CalendarCheck}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Últimas vacantes
            </h2>
            <p className="text-slate-500 text-sm">
              Vacantes publicadas recientemente.
            </p>
          </div>

          <div className="space-y-5">
            {jobs.slice(0, 2).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Postulaciones recientes
            </h2>
            <p className="text-slate-500 text-sm">
              Candidatos que requieren revisión de RRHH.
            </p>
          </div>

          <div className="space-y-5">
            {applications.slice(0, 2).map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default RrhhDashboard;