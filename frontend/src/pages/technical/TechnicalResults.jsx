import {
  CheckCircle2,
  XCircle,
  EyeOff,
  Search,
  UserRound,
  ClipboardList,
  Timer,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useData } from "../../context/DataContext.jsx";

function TechnicalResults() {
  const { applications, evaluations, completeTechnicalReview } = useData();
  const [search, setSearch] = useState("");

  const assignedCandidates = applications.filter((application) =>
    [
      "EVALUACION_PENDIENTE",
      "EVALUACION_COMPLETADA",
      "APROBADO_TECNICO",
      "RECHAZADO_TECNICO",
    ].includes(application.status)
  );

  const filteredCandidates = assignedCandidates.filter((candidate) => {
    return (
      candidate.candidate.toLowerCase().includes(search.toLowerCase()) ||
      candidate.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      candidate.area.toLowerCase().includes(search.toLowerCase())
    );
  });

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">En evaluación</p>
          <p className="text-4xl font-black text-sky-600 mt-2">
            {
              assignedCandidates.filter(
                (item) => item.status === "EVALUACION_PENDIENTE"
              ).length
            }
          </p>
        </div>

        <div className="bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Completadas</p>
          <p className="text-4xl font-black text-violet-600 mt-2">
            {
              assignedCandidates.filter(
                (item) => item.status === "EVALUACION_COMPLETADA"
              ).length
            }
          </p>
        </div>

        <div className="bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Revisadas</p>
          <p className="text-4xl font-black text-emerald-600 mt-2">
            {
              assignedCandidates.filter((item) =>
                ["APROBADO_TECNICO", "RECHAZADO_TECNICO"].includes(item.status)
              ).length
            }
          </p>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-5 mb-8 shadow-sm">
        <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
          <Search size={18} className="text-emerald-600" />
          <input
            type="text"
            placeholder="Buscar por candidato, vacante o área..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-slate-900"
          />
        </div>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="bg-white/95 border border-slate-200 rounded-[2rem] p-10 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-900">
            No hay resultados técnicos aún
          </h2>
          <p className="text-slate-500 mt-2">
            Asigna evaluaciones a los postulantes para que aparezcan en esta vista.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredCandidates.map((candidate) => {
            const evaluation = getEvaluationByApplication(candidate.id);

            return (
              <article
                key={candidate.id}
                className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <UserRound size={25} />
                    </div>

                    <div>
                      <p className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black mb-2">
                        {candidate.area}
                      </p>

                      <h3 className="text-2xl font-black text-slate-900">
                        {candidate.candidate}
                      </h3>

                      <p className="text-slate-500 mt-1">
                        Vacante:{" "}
                        <span className="font-bold text-slate-700">
                          {candidate.jobTitle}
                        </span>
                      </p>

                      <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                        <ClipboardList size={16} className="text-emerald-600" />
                        Evaluación: {evaluation?.title || "No asignada"}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={candidate.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                      <HelpCircle size={17} className="text-emerald-600" />
                      Puntaje interno
                    </div>
                    <p className="text-3xl font-black text-slate-900 mt-2">
                      {evaluation?.score ?? "Pendiente"}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                      <Timer size={17} className="text-emerald-600" />
                      Duración
                    </div>
                    <p className="text-3xl font-black text-slate-900 mt-2">
                      {evaluation?.duration || "-"} min
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
                      <ClipboardList size={17} className="text-emerald-600" />
                      Preguntas
                    </div>
                    <p className="text-3xl font-black text-slate-900 mt-2">
                      {evaluation?.questions || "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm text-slate-500 bg-gradient-to-br from-emerald-50 to-sky-50 border border-emerald-100 rounded-3xl p-4">
                  <EyeOff size={17} className="text-emerald-600" />
                  El puntaje solo es visible para el equipo técnico y RRHH.
                </div>

                <div className="mt-6 flex flex-col md:flex-row gap-3">
                  <button
                    onClick={() =>
                      completeTechnicalReview(candidate.id, "approved")
                    }
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-2xl font-black shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 size={18} />
                    Aprobar técnicamente
                  </button>

                  <button
                    onClick={() =>
                      completeTechnicalReview(candidate.id, "rejected")
                    }
                    className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-3 rounded-2xl font-black shadow-lg shadow-rose-500/20"
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