import { ClipboardList, Users, CheckCircle2, BarChart3 } from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useData } from "../../context/DataContext.jsx";

function TechnicalDashboard() {
  const { applications, evaluations } = useData();

  const candidatesForReview = applications.filter((application) =>
    ["APROBADO_RRHH", "EVALUACION_PENDIENTE"].includes(application.status)
  );

  const assignedEvaluations = evaluations.filter(
    (evaluation) => evaluation.status === "Asignada"
  );

  const reviewedCandidates = applications.filter((application) =>
    ["APROBADO_TECNICO", "RECHAZADO_TECNICO"].includes(application.status)
  );

  return (
    <div>
      <SectionHeader
        title="Dashboard técnico"
        description="Gestiona evaluaciones técnicas, candidatos asignados y resultados internos."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Evaluaciones"
          value={evaluations.length}
          description="Pruebas en banco técnico"
          icon={ClipboardList}
        />

        <StatCard
          title="Candidatos"
          value={candidatesForReview.length}
          description="Pendientes de revisión"
          icon={Users}
        />

        <StatCard
          title="Asignadas"
          value={assignedEvaluations.length}
          description="Evaluaciones en curso"
          icon={BarChart3}
        />

        <StatCard
          title="Revisados"
          value={reviewedCandidates.length}
          description="Con decisión técnica"
          icon={CheckCircle2}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Evaluaciones recientes
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Banco de evaluaciones técnicas reutilizables.
          </p>

          <div className="mt-5 space-y-4">
            {evaluations.slice(0, 3).map((evaluation) => (
              <div
                key={evaluation.id}
                className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-slate-900">
                    {evaluation.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {evaluation.area} · {evaluation.duration} min ·{" "}
                    {evaluation.questions} preguntas
                  </p>
                </div>

                <StatusBadge status={evaluation.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Candidatos por revisar
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Candidatos derivados por RRHH para evaluación técnica.
          </p>

          <div className="mt-5 space-y-4">
            {candidatesForReview.slice(0, 3).map((candidate) => (
              <div
                key={candidate.id}
                className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-slate-900">
                    {candidate.candidate}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {candidate.jobTitle}
                  </p>
                </div>

                <StatusBadge status={candidate.status} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default TechnicalDashboard;