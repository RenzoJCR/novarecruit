import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Coins,
  MapPin,
  CheckCircle2,
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
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Vacante no encontrada
        </h2>

        <p className="text-slate-500 mt-2">
          La vacante seleccionada no existe o ya no está disponible.
        </p>

        <button
          onClick={() => navigate("/applicant/vacantes")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
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
        className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold mb-6"
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
        <section className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-blue-600 mb-2">
            {job.area}
          </p>

          <h2 className="text-2xl font-bold text-slate-900">
            Descripción del puesto
          </h2>

          <p className="text-slate-600 mt-4 leading-relaxed">
            {job.description}
          </p>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Habilidades requeridas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-900">{skill.name}</p>
                    <p className="text-sm text-slate-500">
                      Nivel requerido: {skill.level}
                    </p>
                  </div>

                  <CheckCircle2 className="text-blue-600" size={22} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="text-xl font-bold text-slate-900 mb-5">
            Información general
          </h3>

          <div className="space-y-4 text-slate-600">
            <div className="flex items-center gap-3">
              <Briefcase size={20} className="text-blue-600" />
              <span>{job.modality}</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-blue-600" />
              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-3">
              <Coins size={20} className="text-blue-600" />
              <span>{job.salary}</span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-blue-600" />
              <span>Cierre: {job.closingDate}</span>
            </div>
          </div>

          <button
            onClick={handleApply}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
          >
            Postular a esta vacante
          </button>
        </aside>
      </div>
    </div>
  );
}

export default ApplicantJobDetail;