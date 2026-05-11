import { useMemo, useState } from "react";
import ApplicationCard from "../../components/ui/ApplicationCard.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { useData } from "../../context/DataContext.jsx";

function ApplicantApplications() {
  const { applications } = useData();
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  const filteredApplications = useMemo(() => {
    if (selectedStatus === "Todos") return applications;

    return applications.filter(
      (application) => application.status === selectedStatus
    );
  }, [applications, selectedStatus]);

  return (
    <div>
      <SectionHeader
        title="Mis postulaciones"
        description="Consulta el avance de tus procesos de selección dentro de NovaTech Solutions."
      />

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Filtro por estado</p>
          <h2 className="text-lg font-bold text-slate-900">
            {filteredApplications.length} postulación(es)
          </h2>
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="Todos">Todos</option>
          <option value="POSTULADO">Postulado</option>
          <option value="APROBADO_RRHH">Aprobado RRHH</option>
          <option value="EVALUACION_PENDIENTE">Evaluación pendiente</option>
          <option value="EVALUACION_COMPLETADA">Evaluación completada</option>
          <option value="APROBADO_TECNICO">Aprobado técnico</option>
          <option value="RECHAZADO_FINAL">Rechazado final</option>
        </select>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            No hay postulaciones con ese estado
          </h2>
          <p className="text-slate-500 mt-2">
            Cambia el filtro para ver otros procesos.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ApplicantApplications;