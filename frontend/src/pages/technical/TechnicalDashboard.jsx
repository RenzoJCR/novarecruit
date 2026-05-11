import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Users,
  CheckCircle2,
  BarChart3,
  ArrowRight,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useData } from "../../context/DataContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function TechnicalDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { applications, evaluations } = useData();

  const candidatesForReview = applications.filter((application) =>
    ["APROBADO_RRHH", "EVALUACION_PENDIENTE"].includes(application.status)
  );

  const assignedEvaluations = evaluations.filter(
    (evaluation) => evaluation.status === "Asignada"
  );

  const completedEvaluations = applications.filter(
    (application) => application.status === "EVALUACION_COMPLETADA"
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

      <section className="mb-8 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 rounded-[2rem] p-7 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-20 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-emerald-300 text-sm font-bold mb-5">
              <Sparkles size={16} />
              Evaluación técnica
            </span>

            <h2 className="text-3xl lg:text-4xl font-black">
              Hola, {currentUser?.name || "líder técnico"}
            </h2>

            <p className="text-slate-300 mt-3 max-w-2xl leading-relaxed">
              Desde este panel puedes crear evaluaciones, asignarlas a
              postulantes aprobados por RRHH y emitir una decisión técnica
              interna.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/technical/evaluaciones/create")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 px-5 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20"
              >
                <Plus size={18} />
                Crear evaluación
              </button>

              <button
                onClick={() => navigate("/technical/postulantes")}
                className="inline-flex items-center gap-2 border border-white/15 hover:bg-white/10 px-5 py-3 rounded-2xl font-black"
              >
                Asignar evaluación
              </button>

              <button
                onClick={() => navigate("/technical/resultados")}
                className="inline-flex items-center gap-2 border border-white/15 hover:bg-white/10 px-5 py-3 rounded-2xl font-black"
              >
                Ver resultados
              </button>
            </div>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
            <p className="text-sm text-slate-300 font-semibold">
              Por revisar
            </p>

            <h3 className="text-4xl font-black mt-2">
              {completedEvaluations.length}
            </h3>

            <p className="text-slate-300 text-sm mt-1">
              evaluaciones completadas pendientes de decisión técnica.
            </p>

            <button
              onClick={() => navigate("/technical/resultados")}
              className="mt-5 w-full bg-white text-slate-950 hover:bg-emerald-100 py-3 rounded-2xl font-black"
            >
              Revisar resultados
            </button>
          </div>
        </div>
      </section>

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
        <section className="bg-white/95 border border-slate-200 rounded-[2rem] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Evaluaciones recientes
              </h2>
              <p className="text-slate-500 text-sm">
                Banco de evaluaciones técnicas reutilizables.
              </p>
            </div>

            <button
              onClick={() => navigate("/technical/evaluaciones")}
              className="hidden md:inline-flex items-center gap-2 text-emerald-600 font-black"
            >
              Ver banco
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="space-y-4">
            {evaluations.slice(0, 4).map((evaluation) => (
              <div
                key={evaluation.id}
                className="border border-slate-200 rounded-3xl p-4 flex items-center justify-between gap-4 bg-slate-50"
              >
                <div>
                  <h3 className="font-black text-slate-900">
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

        <section className="bg-white/95 border border-slate-200 rounded-[2rem] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Candidatos por revisar
              </h2>
              <p className="text-slate-500 text-sm">
                Candidatos derivados por RRHH para evaluación técnica.
              </p>
            </div>

            <button
              onClick={() => navigate("/technical/postulantes")}
              className="hidden md:inline-flex items-center gap-2 text-emerald-600 font-black"
            >
              Asignar
              <Send size={17} />
            </button>
          </div>

          <div className="space-y-4">
            {candidatesForReview.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 text-center">
                <h3 className="text-xl font-black text-slate-900">
                  Sin candidatos pendientes
                </h3>
                <p className="text-slate-500 mt-2">
                  Los candidatos aprobados por RRHH aparecerán aquí.
                </p>
              </div>
            ) : (
              candidatesForReview.slice(0, 4).map((candidate) => (
                <div
                  key={candidate.id}
                  className="border border-slate-200 rounded-3xl p-4 flex items-center justify-between gap-4 bg-slate-50"
                >
                  <div>
                    <h3 className="font-black text-slate-900">
                      {candidate.candidate}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {candidate.jobTitle}
                    </p>
                  </div>

                  <StatusBadge status={candidate.status} />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default TechnicalDashboard;