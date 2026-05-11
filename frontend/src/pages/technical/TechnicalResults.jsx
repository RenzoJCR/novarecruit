import { CheckCircle2, XCircle, EyeOff } from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useData } from "../../context/DataContext.jsx";

function TechnicalResults() {
  const { applications, evaluations, completeTechnicalReview } = useData();

  const assignedCandidates = applications.filter((application) =>
    [
      "EVALUACION_PENDIENTE",
      "EVALUACION_COMPLETADA",
      "APROBADO_TECNICO",
      "RECHAZADO_TECNICO",
    ].includes(application.status)
  );

  const getEvaluationByApplication = (applicationId) => {
    return evaluations.find(
      (evaluation) => evaluation.assignedApplicationId === applicationId
    );
  };

  return (
    <div>
      <SectionHeader
        title="Resultados técnicos"
        description="Vista interna para revisar puntajes y emitir decisión técnica. El postulante no visualiza su nota."
      />

      {assignedCandidates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            No hay resultados técnicos aún
          </h2>
          <p className="text-slate-500 mt-2">
            Asigna evaluaciones a los postulantes para que aparezcan en esta vista.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {assignedCandidates.map((candidate) => {
            const evaluation = getEvaluationByApplication(candidate.id);

            return (
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

                    <p className="text-sm text-slate-500 mt-2">
                      Evaluación: {evaluation?.title || "No asignada"}
                    </p>
                  </div>

                  <StatusBadge status={candidate.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-sm text-slate-500">Puntaje interno</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {evaluation?.score ?? "Pendiente"}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-sm text-slate-500">Duración</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {evaluation?.duration || "-"} min
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-sm text-slate-500">Preguntas</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {evaluation?.questions || "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                  <EyeOff size={17} />
                  El puntaje solo es visible para el equipo técnico y RRHH.
                </div>

                <div className="mt-6 flex flex-col md:flex-row gap-3">
                  <button
                    onClick={() =>
                      completeTechnicalReview(candidate.id, "approved")
                    }
                    className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold"
                  >
                    <CheckCircle2 size={18} />
                    Aprobar técnicamente
                  </button>

                  <button
                    onClick={() =>
                      completeTechnicalReview(candidate.id, "rejected")
                    }
                    className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold"
                  >
                    <XCircle size={18} />
                    Rechazar técnicamente
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TechnicalResults;