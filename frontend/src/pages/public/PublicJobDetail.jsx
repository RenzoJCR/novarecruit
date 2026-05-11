import { Link, useParams } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  Coins,
  MapPin,
  Lock,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { jobs } from "../../data/jobs.js";
import StatusBadge from "../../components/ui/StatusBadge.jsx";

function PublicJobDetail() {
  const { id } = useParams();

  const job = jobs.find((item) => item.id === Number(id));

  if (!job) {
    return (
      <section className="px-8 py-12 max-w-5xl mx-auto">
        <div className="glass-card rounded-3xl p-10 text-center">
          <h1 className="text-3xl font-black">Vacante no encontrada</h1>

          <p className="text-slate-400 mt-3">
            La vacante seleccionada no está disponible.
          </p>

          <Link
            to="/vacantes"
            className="inline-flex items-center gap-2 mt-6 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 px-5 py-3 rounded-2xl font-black"
          >
            <ArrowLeft size={18} />
            Volver a vacantes
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-12 max-w-7xl mx-auto">
      <Link
        to="/vacantes"
        className="inline-flex items-center gap-2 text-slate-300 hover:text-emerald-300 font-bold mb-7"
      >
        <ArrowLeft size={18} />
        Volver a vacantes
      </Link>

      <div className="mb-8 glass-card rounded-[2rem] p-8">
        <p className="inline-flex px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-300/20 text-emerald-300 text-sm font-bold">
          {job.area}
        </p>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mt-5">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight">
              {job.title}
            </h1>

            <p className="text-slate-400 mt-4 max-w-2xl leading-relaxed">
              Revisa los detalles generales de esta oportunidad en NovaTech
              Solutions. Para postular, deberás crear una cuenta o iniciar
              sesión como postulante.
            </p>
          </div>

          <StatusBadge status={job.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 glass-card rounded-[2rem] p-7">
          <h2 className="text-2xl font-black">Descripción del puesto</h2>

          <p className="text-slate-300 mt-4 leading-relaxed">
            {job.description}
          </p>

          <div className="mt-9">
            <h3 className="text-xl font-black mb-5">
              Habilidades requeridas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="border border-white/10 rounded-3xl p-5 flex items-center justify-between bg-slate-950/70"
                >
                  <div>
                    <p className="font-black">{skill.name}</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Nivel requerido: {skill.level}
                    </p>
                  </div>

                  <CheckCircle2 className="text-emerald-300" size={23} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="glass-card rounded-[2rem] p-7 h-fit">
          <h3 className="text-xl font-black mb-6">Información general</h3>

          <div className="space-y-4 text-slate-300">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-950/60 border border-white/10 p-4">
              <Briefcase size={20} className="text-emerald-300" />
              <span>{job.modality}</span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-950/60 border border-white/10 p-4">
              <MapPin size={20} className="text-emerald-300" />
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-950/60 border border-white/10 p-4">
              <Coins size={20} className="text-emerald-300" />
              <span>{job.salary}</span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-950/60 border border-white/10 p-4">
              <Calendar size={20} className="text-emerald-300" />
              <span>Cierre: {job.closingDate}</span>
            </div>
          </div>

          <div className="mt-7 bg-slate-950/70 border border-white/10 rounded-3xl p-5">
            <div className="flex items-start gap-3 text-slate-300">
              <Lock size={21} className="text-emerald-300 shrink-0 mt-1" />

              <div>
                <p className="font-black">
                  Para postular necesitas una cuenta
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Tu perfil centralizará tus datos, CV, GitHub y LinkedIn.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-5">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-center px-5 py-3 rounded-2xl font-black"
              >
                Crear cuenta
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="border border-white/10 hover:bg-white/10 text-center px-5 py-3 rounded-2xl font-bold"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default PublicJobDetail;