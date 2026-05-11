import { useNavigate } from "react-router-dom";
import {
  Bell,
  Briefcase,
  ClipboardList,
  FileText,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import StatCard from "../../components/ui/StatCard.jsx";
import JobCard from "../../components/ui/JobCard.jsx";
import ApplicationCard from "../../components/ui/ApplicationCard.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useData } from "../../context/DataContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function ApplicantDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { jobs, applications, evaluations, notifications } = useData();

  const pendingEvaluations = evaluations.filter(
    (evaluation) =>
      evaluation.assignedTo &&
      ["Asignada", "Pendiente"].includes(evaluation.status)
  );

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  );

  const recommendedJobs = jobs.slice(0, 2);
  const latestApplications = applications.slice(0, 2);
  const latestEvaluation = evaluations.find((evaluation) => evaluation.assignedTo);

  return (
    <div>
      <SectionHeader
        title="Dashboard del postulante"
        description="Consulta tus postulaciones, evaluaciones pendientes y vacantes recomendadas."
      />

      <section className="mb-8 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 rounded-[2rem] p-7 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-20 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-emerald-300 text-sm font-bold mb-5">
              <Sparkles size={16} />
              Bienvenido a NovaRecruit
            </span>

            <h2 className="text-3xl lg:text-4xl font-black">
              Hola, {currentUser?.name || "postulante"}
            </h2>

            <p className="text-slate-300 mt-3 max-w-2xl leading-relaxed">
              Desde aquí puedes revisar oportunidades, postular a nuevas
              vacantes, seguir tus procesos activos y completar evaluaciones
              técnicas asignadas.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/applicant/vacantes")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 px-5 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20"
              >
                Ver vacantes
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate("/applicant/postulaciones")}
                className="inline-flex items-center gap-2 border border-white/15 hover:bg-white/10 px-5 py-3 rounded-2xl font-black"
              >
                Mis postulaciones
              </button>

              <button
                onClick={() => navigate("/applicant/evaluaciones")}
                className="inline-flex items-center gap-2 border border-white/15 hover:bg-white/10 px-5 py-3 rounded-2xl font-black"
              >
                Mis evaluaciones
              </button>
            </div>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
            <p className="text-sm text-slate-300 font-semibold">
              Estado destacado
            </p>

            {latestEvaluation ? (
              <div className="mt-4">
                <h3 className="text-xl font-black">{latestEvaluation.title}</h3>
                <p className="text-slate-300 text-sm mt-1">
                  {latestEvaluation.area} · {latestEvaluation.duration} minutos
                </p>

                <div className="mt-4">
                  <StatusBadge status={latestEvaluation.status} />
                </div>

                <button
                  onClick={() => navigate("/applicant/evaluaciones")}
                  className="mt-5 w-full bg-white text-slate-950 hover:bg-emerald-100 py-3 rounded-2xl font-black"
                >
                  Revisar evaluación
                </button>
              </div>
            ) : (
              <div className="mt-4">
                <h3 className="text-xl font-black">
                  Sin evaluaciones pendientes
                </h3>
                <p className="text-slate-300 text-sm mt-1">
                  Cuando un líder técnico te asigne una evaluación, aparecerá
                  aquí.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

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
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Vacantes recomendadas
              </h2>
              <p className="text-slate-500 text-sm">
                Oportunidades que podrían ajustarse a tu perfil.
              </p>
            </div>

            <button
              onClick={() => navigate("/applicant/vacantes")}
              className="hidden md:inline-flex items-center gap-2 text-emerald-600 font-black"
            >
              Ver todas
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="space-y-5">
            {recommendedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onViewDetail={(selectedJob) =>
                  navigate(`/applicant/vacantes/${selectedJob.id}`)
                }
                onApply={() => navigate(`/applicant/vacantes/${job.id}`)}
                detailLabel="Ver detalle"
              />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Últimas postulaciones
              </h2>
              <p className="text-slate-500 text-sm">
                Seguimiento rápido del estado de tus procesos.
              </p>
            </div>

            <button
              onClick={() => navigate("/applicant/postulaciones")}
              className="hidden md:inline-flex items-center gap-2 text-emerald-600 font-black"
            >
              Ver procesos
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="space-y-5">
            {latestApplications.length === 0 ? (
              <div className="bg-white/95 border border-slate-200 rounded-[2rem] p-8 text-center shadow-sm">
                <CheckCircle2 className="mx-auto text-emerald-600" size={32} />
                <h3 className="text-xl font-black text-slate-900 mt-3">
                  Aún no tienes postulaciones
                </h3>
                <p className="text-slate-500 mt-2">
                  Explora vacantes disponibles para iniciar tu primer proceso.
                </p>
              </div>
            ) : (
              latestApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ApplicantDashboard;