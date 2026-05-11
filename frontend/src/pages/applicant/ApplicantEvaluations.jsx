import { Clock, ClipboardList, EyeOff } from "lucide-react";
import { evaluations } from "../../data/evaluations.js";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";

function ApplicantEvaluations() {
  const assignedEvaluations = evaluations.filter(
    (evaluation) => evaluation.assignedTo
  );

  return (
    <div>
      <SectionHeader
        title="Mis evaluaciones"
        description="Aquí verás las evaluaciones técnicas asignadas. El puntaje interno solo será visible para el líder técnico."
      />

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

            <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
              Iniciar evaluación
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ApplicantEvaluations;