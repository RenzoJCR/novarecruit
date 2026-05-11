import { useData } from "../../context/DataContext.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import ApplicationCard from "../../components/ui/ApplicationCard.jsx";

function RrhhCandidates() {
  const { applications } = useData();

  const candidates = applications.filter((application) =>
    [
      "APROBADO_RRHH",
      "EVALUACION_PENDIENTE",
      "EVALUACION_COMPLETADA",
      "APROBADO_TECNICO",
      "SELECCIONADO",
    ].includes(application.status)
  );

  return (
    <div>
      <SectionHeader
        title="Candidatos en proceso"
        description="Candidatos que avanzaron después de la revisión inicial de RRHH."
      />

      {candidates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Aún no hay candidatos en proceso
          </h2>
          <p className="text-slate-500 mt-2">
            Aprueba postulantes desde el módulo de postulaciones para que aparezcan aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {candidates.map((candidate) => (
            <ApplicationCard key={candidate.id} application={candidate} />
          ))}
        </div>
      )}
    </div>
  );
}

export default RrhhCandidates;