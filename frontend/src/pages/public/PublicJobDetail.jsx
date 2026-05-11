import { Link, useParams } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  Coins,
  MapPin,
  Lock,
  CheckCircle2,
} from "lucide-react";

import { jobs } from "../../data/jobs.js";
import StatusBadge from "../../components/ui/StatusBadge.jsx";

function PublicJobDetail() {
  const { id } = useParams();

  const job = jobs.find((item) => item.id === Number(id));

  if (!job) {
    return (
      <section className="px-8 py-12 max-w-5xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-bold">Vacante no encontrada</h1>

          <p className="text-slate-400 mt-2">
            La vacante seleccionada no está disponible.
          </p>

          <Link
            to="/vacantes"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold"
          >
            Volver a vacantes
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-blue-400 font-semibold text-sm">{job.area}</p>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mt-2">
          <div>
            <h1 className="text-4xl font-bold">{job.title}</h1>

            <p className="text-slate-400 mt-3 max-w-2xl">
              Revisa los detalles generales de esta oportunidad en NovaTech
              Solutions.
            </p>
          </div>

          <StatusBadge status={job.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold">Descripción del puesto</h2>

          <p className="text-slate-300 mt-4 leading-relaxed">
            {job.description}
          </p>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">
              Habilidades requeridas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="border border-slate-800 rounded-2xl p-4 flex items-center justify-between bg-slate-950"
                >
                  <div>
                    <p className="font-bold">{skill.name}</p>
                    <p className="text-sm text-slate-400">
                      Nivel requerido: {skill.level}
                    </p>
                  </div>

                  <CheckCircle2 className="text-blue-500" size={22} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
          <h3 className="text-xl font-bold mb-5">Información general</h3>

          <div className="space-y-4 text-slate-300">
            <div className="flex items-center gap-3">
              <Briefcase size={20} className="text-blue-500" />
              <span>{job.modality}</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-blue-500" />
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-3">
              <Coins size={20} className="text-blue-500" />
              <span>{job.salary}</span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-blue-500" />
              <span>Cierre: {job.closingDate}</span>
            </div>
          </div>

          <div className="mt-8 bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-3 text-slate-300">
              <Lock size={20} className="text-blue-500" />

              <p className="font-semibold">
                Para postular necesitas una cuenta.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-5">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-center px-5 py-3 rounded-xl font-semibold"
              >
                Crear cuenta
              </Link>

              <Link
                to="/login"
                className="border border-slate-700 hover:bg-slate-800 text-center px-5 py-3 rounded-xl font-semibold"
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