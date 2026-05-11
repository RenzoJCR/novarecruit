import { useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Search,
  FileText,
  Calendar,
  UserRound,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { useData } from "../../context/DataContext.jsx";

function RrhhApplications() {
  const { applications, updateApplicationStatus } = useData();

  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [search, setSearch] = useState("");

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesStatus =
        selectedStatus === "Todos" || application.status === selectedStatus;

      const matchesSearch =
        application.candidate.toLowerCase().includes(search.toLowerCase()) ||
        application.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        application.area.toLowerCase().includes(search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [applications, selectedStatus, search]);

  const approveApplication = (applicationId) => {
    updateApplicationStatus(applicationId, "APROBADO_RRHH");
  };

  const rejectApplication = (applicationId) => {
    updateApplicationStatus(applicationId, "RECHAZADO_RRHH");
  };

  return (
    <div>
      <SectionHeader
        title="Postulaciones recibidas"
        description="Revisa perfiles, CVs y habilidades declaradas para decidir si avanzan a evaluación técnica."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Total</p>
          <p className="text-4xl font-black text-slate-900 mt-2">
            {applications.length}
          </p>
        </div>

        <div className="bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Postulados</p>
          <p className="text-4xl font-black text-sky-600 mt-2">
            {applications.filter((item) => item.status === "POSTULADO").length}
          </p>
        </div>

        <div className="bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Aprobados</p>
          <p className="text-4xl font-black text-emerald-600 mt-2">
            {
              applications.filter((item) => item.status === "APROBADO_RRHH")
                .length
            }
          </p>
        </div>

        <div className="bg-white/95 border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">Resultados</p>
          <p className="text-4xl font-black text-violet-600 mt-2">
            {filteredApplications.length}
          </p>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-5 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
        <div className="md:col-span-2 flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
          <Search size={18} className="text-emerald-600" />
          <input
            type="text"
            placeholder="Buscar por candidato, vacante o área..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-slate-900"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="input-light"
        >
          <option value="Todos">Todos los estados</option>
          <option value="POSTULADO">Postulado</option>
          <option value="APROBADO_RRHH">Aprobado RRHH</option>
          <option value="RECHAZADO_RRHH">Rechazado RRHH</option>
          <option value="EVALUACION_PENDIENTE">Evaluación pendiente</option>
          <option value="EVALUACION_COMPLETADA">Evaluación completada</option>
          <option value="APROBADO_TECNICO">Aprobado técnico</option>
          <option value="RECHAZADO_TECNICO">Rechazado técnico</option>
        </select>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="bg-white/95 border border-slate-200 rounded-[2rem] p-10 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-900">
            No se encontraron postulaciones
          </h2>
          <p className="text-slate-500 mt-2">
            Cambia los filtros para ver otros resultados.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredApplications.map((application) => (
            <article
              key={application.id}
              className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <UserRound size={25} />
                  </div>

                  <div>
                    <p className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black mb-2">
                      {application.area}
                    </p>

                    <h3 className="text-2xl font-black text-slate-900">
                      {application.candidate}
                    </h3>

                    <p className="text-slate-500 mt-1">
                      Postula a:{" "}
                      <span className="font-bold text-slate-700">
                        {application.jobTitle}
                      </span>
                    </p>

                    <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                      <Calendar size={16} className="text-emerald-600" />
                      Fecha de postulación: {application.appliedAt}
                    </p>
                  </div>
                </div>

                <StatusBadge status={application.status} />
              </div>

              <div className="mt-6">
                <h4 className="font-black text-slate-900 mb-3">
                  Habilidades declaradas
                </h4>

                <div className="flex flex-wrap gap-2">
                  {application.skills.map((skill) => (
                    <span
                      key={`${application.id}-${skill.name}`}
                      className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200"
                    >
                      {skill.name} · {skill.level} · {skill.years} año(s)
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <a
                  href={application.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-600 font-black"
                >
                  <FileText size={18} />
                  Ver CV del postulante
                </a>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => approveApplication(application.id)}
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl font-black shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle2 size={18} />
                    Aprobar
                  </button>

                  <button
                    onClick={() => rejectApplication(application.id)}
                    className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-2xl font-black shadow-lg shadow-rose-500/20"
                  >
                    <XCircle size={18} />
                    Rechazar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default RrhhApplications;