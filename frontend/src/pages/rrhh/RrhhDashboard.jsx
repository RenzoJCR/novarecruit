import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  UserCheck,
  CalendarCheck,
  ArrowRight,
  Plus,
  SearchCheck,
  Sparkles,
} from "lucide-react";

import StatCard from "../../components/ui/StatCard.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import JobCard from "../../components/ui/JobCard.jsx";
import ApplicationCard from "../../components/ui/ApplicationCard.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useData } from "../../context/DataContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function RrhhDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { jobs, applications } = useData();

  const activeJobs = jobs.filter((job) => job.status === "Activa");
  const pendingApplications = applications.filter(
    (application) => application.status === "POSTULADO"
  );
  const approvedByRrhh = applications.filter(
    (application) => application.status === "APROBADO_RRHH"
  );
  const technicalApproved = applications.filter(
    (application) => application.status === "APROBADO_TECNICO"
  );

  return (
    <div>
      <SectionHeader
        title="Dashboard de RRHH"
        description="Gestiona vacantes, postulaciones, candidatos y entrevistas del proceso de selección."
      />

      <section className="mb-8 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 rounded-[2rem] p-7 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-20 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-emerald-300 text-sm font-bold mb-5">
              <Sparkles size={16} />
              Gestión de talento TI
            </span>

            <h2 className="text-3xl lg:text-4xl font-black">
              Hola, {currentUser?.name || "RRHH"}
            </h2>

            <p className="text-slate-300 mt-3 max-w-2xl leading-relaxed">
              Desde este panel puedes publicar vacantes, revisar postulaciones,
              aprobar candidatos y coordinar el avance hacia evaluaciones
              técnicas.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/rrhh/vacantes/create")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 px-5 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20"
              >
                <Plus size={18} />
                Crear vacante
              </button>

              <button
                onClick={() => navigate("/rrhh/postulaciones")}
                className="inline-flex items-center gap-2 border border-white/15 hover:bg-white/10 px-5 py-3 rounded-2xl font-black"
              >
                Revisar postulaciones
              </button>

              <button
                onClick={() => navigate("/rrhh/candidatos")}
                className="inline-flex items-center gap-2 border border-white/15 hover:bg-white/10 px-5 py-3 rounded-2xl font-black"
              >
                Ver candidatos
              </button>
            </div>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
            <p className="text-sm text-slate-300 font-semibold">
              Bandeja RRHH
            </p>

            <h3 className="text-4xl font-black mt-2">
              {pendingApplications.length}
            </h3>

            <p className="text-slate-300 text-sm mt-1">
              postulaciones pendientes de revisión.
            </p>

            <button
              onClick={() => navigate("/rrhh/postulaciones")}
              className="mt-5 w-full bg-white text-slate-950 hover:bg-emerald-100 py-3 rounded-2xl font-black"
            >
              Revisar ahora
            </button>
          </div>
        </div>
      </section>

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
          title="Aprobados técnicos"
          value={technicalApproved.length}
          description="Listos para entrevista"
          icon={CalendarCheck}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Últimas vacantes
              </h2>
              <p className="text-slate-500 text-sm">
                Vacantes publicadas recientemente.
              </p>
            </div>

            <button
              onClick={() => navigate("/rrhh/vacantes")}
              className="hidden md:inline-flex items-center gap-2 text-emerald-600 font-black"
            >
              Ver todas
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="space-y-5">
            {jobs.slice(0, 2).map((job) => (
              <JobCard
                key={job.id}
                job={job}
                showApplyButton={false}
                detailLabel="Gestionar"
                onViewDetail={() => navigate("/rrhh/vacantes")}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Postulaciones recientes
              </h2>
              <p className="text-slate-500 text-sm">
                Candidatos que requieren revisión de RRHH.
              </p>
            </div>

            <button
              onClick={() => navigate("/rrhh/postulaciones")}
              className="hidden md:inline-flex items-center gap-2 text-emerald-600 font-black"
            >
              Revisar
              <ArrowRight size={17} />
            </button>
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

      <section className="mt-8 bg-white/95 border border-slate-200 rounded-[2rem] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center">
            <SearchCheck size={24} />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900">
              Estados del proceso
            </h2>
            <p className="text-sm text-slate-500">
              Resumen rápido de postulaciones recientes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {applications.slice(0, 3).map((application) => (
            <div
              key={application.id}
              className="rounded-3xl bg-slate-50 border border-slate-200 p-5"
            >
              <h3 className="font-black text-slate-900">
                {application.candidate}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {application.jobTitle}
              </p>
              <div className="mt-4">
                <StatusBadge status={application.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default RrhhDashboard;