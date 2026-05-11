const statusStyles = {
  Activa: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cerrada: "bg-rose-50 text-rose-700 border-rose-200",
  Pausada: "bg-amber-50 text-amber-700 border-amber-200",

  POSTULADO: "bg-slate-100 text-slate-700 border-slate-200",
  REVISION_RRHH: "bg-sky-50 text-sky-700 border-sky-200",
  APROBADO_RRHH: "bg-emerald-50 text-emerald-700 border-emerald-200",
  RECHAZADO_RRHH: "bg-rose-50 text-rose-700 border-rose-200",
  EVALUACION_PENDIENTE: "bg-amber-50 text-amber-700 border-amber-200",
  EVALUACION_COMPLETADA: "bg-violet-50 text-violet-700 border-violet-200",
  APROBADO_TECNICO: "bg-emerald-50 text-emerald-700 border-emerald-200",
  RECHAZADO_TECNICO: "bg-rose-50 text-rose-700 border-rose-200",
  SELECCIONADO: "bg-teal-50 text-teal-700 border-teal-200",
  RECHAZADO_FINAL: "bg-rose-50 text-rose-700 border-rose-200",

  Disponible: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Asignada: "bg-sky-50 text-sky-700 border-sky-200",
  Completada: "bg-violet-50 text-violet-700 border-violet-200",
  Calificada: "bg-teal-50 text-teal-700 border-teal-200",
  Pendiente: "bg-amber-50 text-amber-700 border-amber-200",

  Activo: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Inactivo: "bg-slate-100 text-slate-700 border-slate-200",
};

const statusLabels = {
  POSTULADO: "Postulado",
  REVISION_RRHH: "Revisión RRHH",
  APROBADO_RRHH: "Aprobado RRHH",
  RECHAZADO_RRHH: "Rechazado RRHH",
  EVALUACION_PENDIENTE: "Evaluación pendiente",
  EVALUACION_COMPLETADA: "Evaluación completada",
  APROBADO_TECNICO: "Aprobado técnico",
  RECHAZADO_TECNICO: "Rechazado técnico",
  SELECCIONADO: "Seleccionado",
  RECHAZADO_FINAL: "Rechazado final",
};

function StatusBadge({ status }) {
  const style =
    statusStyles[status] || "bg-slate-100 text-slate-700 border-slate-200";

  const label = statusLabels[status] || status;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${style}`}
    >
      <span className="w-2 h-2 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

export default StatusBadge;