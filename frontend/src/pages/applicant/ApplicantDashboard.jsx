import { Bell, Briefcase, ClipboardList, FileText } from "lucide-react";
import { jobs } from "../../data/jobs.js";
import { applications } from "../../data/applications.js";
import { evaluations } from "../../data/evaluations.js";
import { notifications } from "../../data/notifications.js";
import StatCard from "../../components/ui/StatCard.jsx";
import JobCard from "../../components/ui/JobCard.jsx";
import ApplicationCard from "../../components/ui/ApplicationCard.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";

function ApplicantDashboard() {
  const pendingEvaluations = evaluations.filter(
    (evaluation) => evaluation.status === "Asignada"
  );

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  );

  const recommendedJobs = jobs.slice(0, 2);
  const latestApplications = applications.slice(0, 2);

  return (
    <div>
      <SectionHeader
        title="Dashboard del postulante"
        description="Consulta tus postulaciones, evaluaciones pendientes y vacantes recomendadas."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Postulaciones"
          value={applications.length}
          description="Procesos iniciados"
          icon={FileText}
        />

        <StatCard
          title="Vacantes activas"
          value={jobs.length}
          description="Disponibles para postular"
          icon={Briefcase}
        />

        <StatCard
          title="Evaluaciones"
          value={pendingEvaluations.length}
          description="Pendientes o asignadas"
          icon={ClipboardList}
        />

        <StatCard
          title="Notificaciones"
          value={unreadNotifications.length}
          description="Sin leer"
          icon={Bell}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Vacantes recomendadas
            </h2>
            <p className="text-slate-500 text-sm">
              Oportunidades que podrían ajustarse a tu perfil.
            </p>
          </div>

          <div className="space-y-5">
            {recommendedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Últimas postulaciones
            </h2>
            <p className="text-slate-500 text-sm">
              Seguimiento rápido del estado de tus procesos.
            </p>
          </div>

          <div className="space-y-5">
            {latestApplications.map((application) => (
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

export default ApplicantDashboard;