import { useState } from "react";
import { Send } from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useData } from "../../context/DataContext.jsx";

function TechnicalApplicants() {
  const {
    applications,
    evaluations,
    assignEvaluationToCandidate,
  } = useData();

  const candidates = applications.filter((application) =>
    ["APROBADO_RRHH", "EVALUACION_PENDIENTE"].includes(application.status)
  );

  const availableEvaluations = evaluations.filter(
    (evaluation) => evaluation.status === "Disponible"
  );

  const [selectedEvaluations, setSelectedEvaluations] = useState({});
  const [message, setMessage] = useState("");

  const handleSelectEvaluation = (applicationId, evaluationId) => {
    setSelectedEvaluations((prevSelected) => ({
      ...prevSelected,
      [applicationId]: evaluationId,
    }));
  };

  const handleAssignEvaluation = (application) => {
    const selectedEvaluationId = selectedEvaluations[application.id];

    if (!selectedEvaluationId) {
      setMessage("Selecciona una evaluación antes de asignarla.");
      return;
    }

    const result = assignEvaluationToCandidate(
      application.id,
      selectedEvaluationId
    );

    setMessage(result.message);
  };

  return (
    <div>
      <SectionHeader
        title="Postulantes asignados"
        description="Candidatos aprobados por RRHH y listos para revisión técnica."
      />

      {message && (
        <div className="mb-5 bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl px-5 py-4 font-medium">
          {message}
        </div>
      )}

      {candidates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            No hay postulantes asignados
          </h2>
          <p className="text-slate-500 mt-2">
            Los candidatos aprobados por RRHH aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {candidates.map((candidate) => (
            <article
              key={candidate.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                <div>
                  <p className="text-sm font-semibold text-blue-600 mb-2">
                    {candidate.area}
                  </p>

                  <h3 className="text-xl font-bold text-slate-900">
                    {candidate.candidate}
                  </h3>

                  <p className="text-slate-500 mt-1">
                    Vacante: {candidate.jobTitle}
                  </p>
                </div>

                <StatusBadge status={candidate.status} />
              </div>

              <div className="mt-5">
                <h4 className="font-bold text-slate-900 mb-3">
                  Habilidades declaradas
                </h4>

                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <span
                      key={`${candidate.id}-${skill.name}`}
                      className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      {skill.name} · {skill.level} · {skill.years} año(s)
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                <select
                  value={selectedEvaluations[candidate.id] || ""}
                  onChange={(e) =>
                    handleSelectEvaluation(candidate.id, e.target.value)
                  }
                  disabled={candidate.status === "EVALUACION_PENDIENTE"}
                  className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 disabled:bg-slate-100"
                >
                  <option value="">
                    {candidate.status === "EVALUACION_PENDIENTE"
                      ? "Evaluación ya asignada"
                      : "Seleccionar evaluación"}
                  </option>

                  {availableEvaluations.map((evaluation) => (
                    <option key={evaluation.id} value={evaluation.id}>
                      {evaluation.title} · {evaluation.area}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleAssignEvaluation(candidate)}
                  disabled={candidate.status === "EVALUACION_PENDIENTE"}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-5 py-3 rounded-xl font-semibold"
                >
                  <Send size={18} />
                  Asignar evaluación
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default TechnicalApplicants;