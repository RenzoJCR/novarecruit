import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useData } from "../../context/DataContext.jsx";

function RrhhApplications() {
  const { applications, updateApplicationStatus } = useData();

  const [selectedStatus, setSelectedStatus] = useState("Todos");

  const filteredApplications = useMemo(() => {
    if (selectedStatus === "Todos") return applications;

    return applications.filter(
      (application) => application.status === selectedStatus
    );
  }, [applications, selectedStatus]);

  const approveApplication = (applicationId) => {
    updateApplicationStatus(applicationId, "APROBADO_RRHH");
  };

  const rejectApplication = (applicationId) => {
    updateApplicationStatus(applicationId, "RECHAZADO_RRHH");
  };

  return (
    <div>
      <SectionHeader
        title="Postulaciones recibidas"
        description="Revisa los datos del candidato, sus habilidades declaradas y decide si avanza a evaluación técnica."
      />

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Postulaciones filtradas</p>
          <h2 className="text-lg font-bold text-slate-900">
            {filteredApplications.length} resultado(s)
          </h2>
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="Todos">Todos</option>
          <option value="POSTULADO">Postulado</option>
          <option value="APROBADO_RRHH">Aprobado RRHH</option>
          <option value="RECHAZADO_RRHH">Rechazado RRHH</option>
          <option value="EVALUACION_PENDIENTE">Evaluación pendiente</option>
          <option value="APROBADO_TECNICO">Aprobado técnico</option>
        </select>
      </div>

      <div className="space-y-5">
        {filteredApplications.map((application) => (
          <article
            key={application.id}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
              <div>
                <p className="text-sm font-semibold text-blue-600 mb-2">
                  {application.area}
                </p>

                <h3 className="text-xl font-bold text-slate-900">
                  {application.candidate}
                </h3>

                <p className="text-slate-500 mt-1">
                  Postula a: {application.jobTitle}
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Fecha de postulación: {application.appliedAt}
                </p>
              </div>

              <StatusBadge status={application.status} />
            </div>

            <div className="mt-5">
              <h4 className="font-bold text-slate-900 mb-3">
                Habilidades declaradas
              </h4>

              <div className="flex flex-wrap gap-2">
                {application.skills.map((skill) => (
                  <span
                    key={`${application.id}-${skill.name}`}
                    className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    {skill.name} · {skill.level} · {skill.years} año(s)
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <a
                href={application.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 font-semibold"
              >
                Ver CV del postulante
              </a>

              <div className="flex gap-3">
                <button
                  onClick={() => approveApplication(application.id)}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-semibold"
                >
                  <CheckCircle2 size={18} />
                  Aprobar
                </button>

                <button
                  onClick={() => rejectApplication(application.id)}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-semibold"
                >
                  <XCircle size={18} />
                  Rechazar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default RrhhApplications;