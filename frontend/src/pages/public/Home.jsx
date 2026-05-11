import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Users, ClipboardCheck, Building2 } from "lucide-react";
import { jobs } from "../../data/jobs.js";
import JobCard from "../../components/ui/JobCard.jsx";
import StatCard from "../../components/ui/StatCard.jsx";

function Home() {
  const featuredJobs = jobs.slice(0, 2);

  return (
    <div>
      <section className="px-8 py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-block mb-5 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm">
              NovaTech Solutions · Reclutamiento tecnológico
            </span>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Encuentra tu lugar en el equipo que construye el futuro digital.
            </h1>

            <p className="text-slate-300 mt-6 text-lg">
              NovaRecruit conecta talento tecnológico con vacantes de desarrollo web,
              apps móviles, software empresarial, cloud, QA y DevOps.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/vacantes"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
              >
                Ver vacantes
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/register"
                className="border border-slate-700 hover:bg-slate-900 px-6 py-3 rounded-xl font-semibold"
              >
                Crear cuenta
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Proceso de selección</h2>

            <div className="space-y-4">
              {[
                "Registro de perfil",
                "Postulación a vacante",
                "Revisión de RRHH",
                "Evaluación técnica",
                "Resultado final",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800"
                >
                  <span className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <p>{step}</p>
                </div>
              ))}
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Vacantes destacadas</h2>
            <p className="text-slate-400 mt-2">
              Algunas oportunidades disponibles en NovaTech Solutions.
            </p>
          </div>

          <Link to="/vacantes" className="text-blue-400 font-semibold">
            Ver todas
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-900">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;