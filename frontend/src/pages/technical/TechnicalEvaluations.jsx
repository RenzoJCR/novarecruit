import { useNavigate } from "react-router-dom";
import { Clock, ClipboardList, Plus } from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useData } from "../../context/DataContext.jsx";

function TechnicalEvaluations() {
  const navigate = useNavigate();
  const { evaluations } = useData();

  return (
    <div>
      <SectionHeader
        title="Banco de evaluaciones"
        description="Administra evaluaciones técnicas reutilizables para asignarlas a candidatos."
        action={
          <button
            onClick={() => navigate("/technical/evaluaciones/create")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
          >
            <Plus size={18} />
            Crear evaluación
          </button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {evaluations.map((evaluation) => (
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

                {evaluation.assignedTo && (
                  <p className="text-slate-500 mt-1">
                    Asignada a: {evaluation.assignedTo}
                  </p>
                )}
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

            <p className="text-sm text-slate-500 mt-5">
              Puntaje visible para postulante:{" "}
              <span className="font-semibold text-slate-900">
                {evaluation.candidateVisibleScore ? "Sí" : "No"}
              </span>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default TechnicalEvaluations;