import { Clock, ClipboardList, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useData } from "../../context/DataContext.jsx";

function ApplicantEvaluations() {
  const navigate = useNavigate();
  const { evaluations } = useData();

  const assignedEvaluations = evaluations.filter(
    (evaluation) => evaluation.assignedTo
  );

  return (
    <div>
      <SectionHeader
        title="Mis evaluaciones"
        description="Aquí verás las evaluaciones técnicas asignadas. El puntaje interno solo será visible para el líder técnico."
      />

      {assignedEvaluations.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            No tienes evaluaciones asignadas
          </h2>

          <p className="text-slate-500 mt-2">
            Cuando un líder técnico te asigne una evaluación, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assignedEvaluations.map((evaluation) => (
            <article
              key={evaluation.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-blue-600 mb-2">
                    {evaluation.area}
                  </p>
                  <h3 className="text-xl font-bold text-slate-900">
                    {evaluation.title}
                  </h3>
                </div>

                <StatusBadge status={evaluation.status} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
                  <Clock className="text-blue-600" size={22} />
                  <div>
                    <p className="text-sm text-slate-500">Duración</p>
                    <p className="font-bold text-slate-900">
                      {evaluation.duration} min
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
                  <ClipboardList className="text-blue-600" size={22} />
                  <div>
                    <p className="text-sm text-slate-500">Preguntas</p>
                    <p className="font-bold text-slate-900">
                      {evaluation.questions}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                <EyeOff size={17} />
                El puntaje no será visible para el postulante.
              </div>

              <button
                onClick={() => navigate(`/applicant/evaluaciones/${evaluation.id}`)}
                disabled={evaluation.status === "Completada"}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-3 rounded-xl font-semibold"
              >
                {evaluation.status === "Completada"
                  ? "Evaluación enviada"
                  : "Iniciar evaluación"}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApplicantEvaluations;