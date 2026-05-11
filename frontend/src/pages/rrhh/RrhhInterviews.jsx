import { Calendar, Clock, Video } from "lucide-react";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { useData } from "../../context/DataContext.jsx";

function RrhhInterviews() {
  const { applications } = useData();

  const candidatesReady = applications.filter((application) =>
    ["APROBADO_TECNICO", "SELECCIONADO"].includes(application.status)
  );

  return (
    <div>
      <SectionHeader
        title="Entrevistas"
        description="Programación y seguimiento de entrevistas con candidatos aprobados técnicamente."
      />

      {candidatesReady.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            No hay entrevistas pendientes
          </h2>
          <p className="text-slate-500 mt-2">
            Los candidatos aprobados técnicamente aparecerán aquí para programar entrevista.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {candidatesReady.map((candidate) => (
            <article
              key={candidate.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-slate-900">
                {candidate.candidate}
              </h3>

              <p className="text-slate-500 mt-1">
                Vacante: {candidate.jobTitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <Calendar className="text-blue-600 mb-2" size={22} />
                  <p className="text-sm text-slate-500">Fecha</p>
                  <p className="font-bold text-slate-900">Por definir</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <Clock className="text-blue-600 mb-2" size={22} />
                  <p className="text-sm text-slate-500">Hora</p>
                  <p className="font-bold text-slate-900">Pendiente</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4">
                  <Video className="text-blue-600 mb-2" size={22} />
                  <p className="text-sm text-slate-500">Modalidad</p>
                  <p className="font-bold text-slate-900">Virtual</p>
                </div>
              </div>

              <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
                Programar entrevista
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default RrhhInterviews;