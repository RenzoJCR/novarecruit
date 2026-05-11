const statusStyles = {
  Activa: "bg-green-100 text-green-700 border-green-200",
  Cerrada: "bg-red-100 text-red-700 border-red-200",
  Pausada: "bg-yellow-100 text-yellow-700 border-yellow-200",

  POSTULADO: "bg-slate-100 text-slate-700 border-slate-200",
  REVISION_RRHH: "bg-blue-100 text-blue-700 border-blue-200",
  APROBADO_RRHH: "bg-green-100 text-green-700 border-green-200",
  RECHAZADO_RRHH: "bg-red-100 text-red-700 border-red-200",
  EVALUACION_PENDIENTE: "bg-yellow-100 text-yellow-700 border-yellow-200",
  EVALUACION_COMPLETADA: "bg-purple-100 text-purple-700 border-purple-200",
  APROBADO_TECNICO: "bg-green-100 text-green-700 border-green-200",
  RECHAZADO_TECNICO: "bg-red-100 text-red-700 border-red-200",
  SELECCIONADO: "bg-emerald-100 text-emerald-700 border-emerald-200",
  RECHAZADO_FINAL: "bg-red-100 text-red-700 border-red-200",

  Disponible: "bg-green-100 text-green-700 border-green-200",
  Asignada: "bg-blue-100 text-blue-700 border-blue-200",
  Pendiente: "bg-yellow-100 text-yellow-700 border-yellow-200",
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
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${style}`}
    >
      {label}
    </span>
  );
}

export default StatusBadge;