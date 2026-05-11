import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Coins,
  MapPin,
  CheckCircle2,
  Send,
} from "lucide-react";

import { useData } from "../../context/DataContext.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";

function ApplicantJobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, applyToJob } = useData();

  const job = jobs.find((item) => item.id === Number(id));

  const handleApply = () => {
    if (!job) return;

    const result = applyToJob(job);

    if (result.ok) {
      navigate("/applicant/postulaciones");
    } else {
      alert(result.message);
    }
  };

  if (!job) {
    return (
      <div className="bg-white/90 border border-slate-200 rounded-3xl p-10 text-center shadow-sm">
        <h2 className="text-2xl font-black text-slate-900">
          Vacante no encontrada
        </h2>

        <p className="text-slate-500 mt-2">
          La vacante seleccionada no existe o ya no está disponible.
        </p>

        <button
          onClick={() => navigate("/applicant/vacantes")}
          className="mt-6 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white px-5 py-3 rounded-2xl font-black"
        >
          Volver a vacantes
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/applicant/vacantes")}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-bold mb-6"
      >
        <ArrowLeft size={18} />
        Volver a vacantes
      </button>

      <SectionHeader
        title={job.title}
        description="Revisa los detalles de la vacante antes de enviar tu postulación."
        action={<StatusBadge status={job.status} />}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-7 shadow-sm">
          <p className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-sm font-bold mb-5">
            {job.area}
          </p>

          <h2 className="text-2xl font-black text-slate-900">
            Descripción del puesto
          </h2>

          <p className="text-slate-600 mt-4 leading-relaxed">
            {job.description}
          </p>

          <div className="mt-9">
            <h3 className="text-xl font-black text-slate-900 mb-5">
              Habilidades requeridas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="border border-slate-200 rounded-3xl p-5 flex items-center justify-between bg-slate-50"
                >
                  <div>
                    <p className="font-black text-slate-900">{skill.name}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Nivel requerido: {skill.level}
                    </p>
                  </div>

                  <CheckCircle2 className="text-emerald-600" size={23} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-7 shadow-sm h-fit">
          <h3 className="text-xl font-black text-slate-900 mb-6">
            Información general
          </h3>

          <div className="space-y-4 text-slate-600">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <Briefcase size={20} className="text-emerald-600" />
              <span>{job.modality}</span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <MapPin size={20} className="text-emerald-600" />
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <Coins size={20} className="text-emerald-600" />
              <span>{job.salary}</span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <Calendar size={20} className="text-emerald-600" />
              <span>Cierre: {job.closingDate}</span>
            </div>
          </div>

          <div className="mt-7 rounded-3xl bg-gradient-to-br from-emerald-50 to-sky-50 border border-emerald-100 p-5">
            <p className="text-sm text-slate-600">
              Al postular, el sistema usará tu perfil, CV, GitHub y LinkedIn
              registrados. Solo se guardará tu postulación y habilidades
              declaradas.
            </p>
          </div>

          <button
            onClick={handleApply}
            className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20"
          >
            <Send size={18} />
            Postular a esta vacante
          </button>
        </aside>
      </div>
    </div>
  );
}

export default ApplicantJobDetail;