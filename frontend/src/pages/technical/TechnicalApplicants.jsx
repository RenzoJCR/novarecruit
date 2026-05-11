import { useState } from "react";
import { Send, Search, UserRound, ClipboardList, FileText } from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useData } from "../../context/DataContext.jsx";

function TechnicalApplicants() {
  const { applications, evaluations, assignEvaluationToCandidate } = useData();

  const candidates = applications.filter((application) =>
    ["APROBADO_RRHH", "EVALUACION_PENDIENTE"].includes(application.status)
  );

  const availableEvaluations = evaluations.filter(
    (evaluation) => evaluation.status === "Disponible"
  );

  const [selectedEvaluations, setSelectedEvaluations] = useState({});
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const filteredCandidates = candidates.filter((candidate) => {
    return (
      candidate.candidate.toLowerCase().includes(search.toLowerCase()) ||
      candidate.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      candidate.area.toLowerCase().includes(search.toLowerCase())
    );
  });

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
        <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-3xl px-5 py-4 font-semibold">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Candidatos</p>
          <p className="text-4xl font-black text-slate-900 mt-2">
            {candidates.length}
          </p>
        </div>

        <div className="bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Evaluaciones disponibles</p>
          <p className="text-4xl font-black text-emerald-600 mt-2">
            {availableEvaluations.length}
          </p>
        </div>

        <div className="bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">En evaluación</p>
          <p className="text-4xl font-black text-sky-600 mt-2">
            {
              candidates.filter(
                (candidate) => candidate.status === "EVALUACION_PENDIENTE"
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
            No hay postulantes asignados
          </h2>
          <p className="text-slate-500 mt-2">
            Los candidatos aprobados por RRHH aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredCandidates.map((candidate) => (
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
                  </div>
                </div>

                <StatusBadge status={candidate.status} />
              </div>

              <div className="mt-6">
                <h4 className="font-black text-slate-900 mb-3">
                  Habilidades declaradas
                </h4>

                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <span
                      key={`${candidate.id}-${skill.name}`}
                      className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200"
                    >
                      {skill.name} · {skill.level} · {skill.years} año(s)
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                <div className="relative">
                  <ClipboardList
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                  />
                  <select
                    value={selectedEvaluations[candidate.id] || ""}
                    onChange={(e) =>
                      handleSelectEvaluation(candidate.id, e.target.value)
                    }
                    disabled={candidate.status === "EVALUACION_PENDIENTE"}
                    className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-12 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100 disabled:text-slate-500"
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
                </div>

                <button
                  onClick={() => handleAssignEvaluation(candidate)}
                  disabled={candidate.status === "EVALUACION_PENDIENTE"}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 disabled:from-slate-300 disabled:to-slate-300 text-white px-5 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20 disabled:shadow-none"
                >
                  <Send size={18} />
                  Asignar evaluación
                </button>
              </div>

              <a
                href={candidate.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-5 text-emerald-600 font-black"
              >
                <FileText size={18} />
                Ver CV del candidato
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default TechnicalApplicants;