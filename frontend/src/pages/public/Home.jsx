import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Users,
  ClipboardCheck,
  Building2,
  Sparkles,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { jobs } from "../../data/jobs.js";
import JobCard from "../../components/ui/JobCard.jsx";
import StatCard from "../../components/ui/StatCard.jsx";

function Home() {
  const featuredJobs = jobs.slice(0, 2);

  return (
    <div>
      <section className="px-8 py-24 lg:py-28 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
          <div>
            <span className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-emerald-300 text-sm font-semibold">
              <Sparkles size={16} />
              NovaTech Solutions · Reclutamiento tecnológico
            </span>

            <h1 className="text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight">
              Recluta y conecta talento{" "}
              <span className="gradient-text">tech</span> con procesos más
              inteligentes.
            </h1>

            <p className="text-slate-300 mt-7 text-lg leading-relaxed max-w-2xl">
              NovaRecruit es un sistema de reclutamiento para publicar vacantes,
              revisar candidatos, asignar evaluaciones técnicas y acompañar todo
              el proceso de selección de desarrolladores.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/vacantes"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 px-6 py-3 rounded-2xl font-bold shadow-xl shadow-emerald-500/20"
              >
                Ver vacantes
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="border border-white/15 hover:bg-white/10 px-6 py-3 rounded-2xl font-bold text-slate-100"
              >
                Iniciar demo
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
              <div className="glass-card rounded-3xl p-4">
                <ShieldCheck className="text-emerald-300 mb-3" size={24} />
                <p className="font-bold">Roles definidos</p>
                <p className="text-sm text-slate-400 mt-1">
                  Admin, RRHH, técnico y postulante.
                </p>
              </div>

              <div className="glass-card rounded-3xl p-4">
                <Workflow className="text-sky-300 mb-3" size={24} />
                <p className="font-bold">Flujo completo</p>
                <p className="text-sm text-slate-400 mt-1">
                  Desde postulación hasta evaluación.
                </p>
              </div>

              <div className="glass-card rounded-3xl p-4">
                <ClipboardCheck className="text-teal-300 mb-3" size={24} />
                <p className="font-bold">Evaluaciones</p>
                <p className="text-sm text-slate-400 mt-1">
                  Pruebas técnicas reutilizables.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="glass-card rounded-[2rem] p-7 shadow-2xl">
              <div className="flex items-center justify-between mb-7">
                <div>
                  <p className="text-sm text-emerald-300 font-bold">
                    Flujo de selección
                  </p>
                  <h2 className="text-2xl font-black mt-1">
                    Proceso NovaRecruit
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-emerald-400/15 text-emerald-300 flex items-center justify-center">
                  <Workflow size={25} />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Registro de perfil",
                    description: "El postulante completa datos, CV, GitHub y LinkedIn.",
                  },
                  {
                    title: "Postulación a vacante",
                    description: "Selecciona puesto y declara habilidades requeridas.",
                  },
                  {
                    title: "Revisión de RRHH",
                    description: "RRHH revisa perfil, CV y avance del candidato.",
                  },
                  {
                    title: "Evaluación técnica",
                    description: "El líder técnico asigna y revisa la evaluación.",
                  },
                  {
                    title: "Resultado final",
                    description: "RRHH continúa con entrevista o cierre del proceso.",
                  },
                ].map((step, index) => (
                  <div
                    key={step.title}
                    className="flex gap-4 bg-slate-950/70 p-4 rounded-3xl border border-white/10"
                  >
                    <span className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-400 text-slate-950 flex items-center justify-center font-black">
                      {index + 1}
                    </span>

                    <div>
                      <p className="font-bold">{step.title}</p>
                      <p className="text-sm text-slate-400 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            
          </div>
        </div>
      </section>

      <section className="px-8 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <StatCard
            title="Vacantes activas"
            value={jobs.length}
            description="Oportunidades disponibles"
            icon={Briefcase}
          />
          <StatCard
            title="Áreas TI"
            value="6"
            description="Frontend, Backend, QA y más"
            icon={Building2}
          />
          <StatCard
            title="Postulantes"
            value="+120"
            description="Talento registrado"
            icon={Users}
          />
          <StatCard
            title="Evaluaciones"
            value="+35"
            description="Pruebas técnicas activas"
            icon={ClipboardCheck}
          />
        </div>
      </section>

      <section className="px-8 pb-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
          <div>
            <p className="text-emerald-300 font-bold text-sm uppercase tracking-wide">
              Oportunidades
            </p>
            <h2 className="text-4xl font-black mt-2">Vacantes destacadas</h2>
            <p className="text-slate-400 mt-2">
              Algunas oportunidades disponibles en NovaTech Solutions.
            </p>
          </div>

          <Link
            to="/vacantes"
            className="text-emerald-300 hover:text-emerald-200 font-bold inline-flex items-center gap-2"
          >
            Ver todas
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-900">
          {featuredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              showApplyButton={false}
              detailLabel="Ver vacante"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;