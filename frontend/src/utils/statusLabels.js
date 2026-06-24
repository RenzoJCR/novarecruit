export function getVacanteEstadoLabel(estado) {
  const labels = {
    ACTIVA: "Activa",
    EN_PROCESO: "En proceso",
    CERRADA: "Cerrada",
    CANCELADA: "Cancelada",
  };

  return labels[estado] || estado || "Sin estado";
}

export function getPostulacionEstadoLabel(estado) {
  const labels = {
    POSTULADO: "Pendiente de revisión",
    EN_REVISION_RRHH: "En revisión",
    APROBADO_RRHH: "Listo para evaluación",
    RECHAZADO_RRHH: "No continúa",
    EVALUACION_PENDIENTE: "Evaluación asignada",
    EVALUACION_COMPLETADA: "Por revisar",
    APROBADO_TECNICO: "Apto para selección",
    RECHAZADO_TECNICO: "No continúa",
    SELECCIONADO: "Seleccionado",
    NO_SELECCIONADO: "No seleccionado",
  };

  return labels[estado] || estado || "Sin estado";
}

export function getEvaluacionPostulacionEstadoLabel(estado) {
  const labels = {
    PENDIENTE: "Pendiente",
    EN_PROGRESO: "En progreso",
    COMPLETADA: "Por revisar",
    REVISADA: "Revisada",
  };

  return labels[estado] || estado || "Sin estado";
}

export function getEvaluacionEstadoLabel(estado) {
  const labels = {
    ACTIVA: "Activa",
    INACTIVA: "Inactiva",
  };

  return labels[estado] || estado || "Sin estado";
}

export function getModalidadLabel(modalidad) {
  const labels = {
    REMOTO: "Remoto",
    HIBRIDO: "Híbrido",
    PRESENCIAL: "Presencial",
  };

  return labels[modalidad] || modalidad || "No especificada";
}

export function getNivelLabel(nivel) {
  const labels = {
    BASICO: "Básico",
    INTERMEDIO: "Intermedio",
    AVANZADO: "Avanzado",
    EXPERTO: "Experto",
    JUNIOR: "Junior",
    SENIOR: "Senior",
    LEAD: "Lead",
  };

  return labels[nivel] || nivel || "No especificado";
}

export function statusClass(estado) {
  const styles = {
    ACTIVA: "bg-emerald-50 text-emerald-700 border-emerald-200",
    EN_PROCESO: "bg-amber-50 text-amber-700 border-amber-200",
    CERRADA: "bg-slate-50 text-slate-600 border-slate-200",
    CANCELADA: "bg-rose-50 text-rose-700 border-rose-200",

    POSTULADO: "bg-amber-50 text-amber-700 border-amber-200",
    EN_REVISION_RRHH: "bg-sky-50 text-sky-700 border-sky-200",
    APROBADO_RRHH: "bg-emerald-50 text-emerald-700 border-emerald-200",
    RECHAZADO_RRHH: "bg-rose-50 text-rose-700 border-rose-200",
    EVALUACION_PENDIENTE: "bg-indigo-50 text-indigo-700 border-indigo-200",
    EVALUACION_COMPLETADA: "bg-violet-50 text-violet-700 border-violet-200",
    APROBADO_TECNICO: "bg-emerald-50 text-emerald-700 border-emerald-200",
    RECHAZADO_TECNICO: "bg-rose-50 text-rose-700 border-rose-200",
    SELECCIONADO: "bg-amber-50 text-amber-700 border-amber-200",
    NO_SELECCIONADO: "bg-slate-50 text-slate-600 border-slate-200",

    PENDIENTE: "bg-amber-50 text-amber-700 border-amber-200",
    EN_PROGRESO: "bg-sky-50 text-sky-700 border-sky-200",
    COMPLETADA: "bg-violet-50 text-violet-700 border-violet-200",
    REVISADA: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INACTIVA: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return styles[estado] || "bg-slate-50 text-slate-600 border-slate-200";
}

export function formatDate(value) {
  if (!value) return "Sin fecha";

  return new Date(`${value}T00:00:00`).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatDateTime(value) {
  if (!value) return "Sin fecha";

  return new Date(value).toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function formatMoney(value) {
  if (value === null || value === undefined) return "No especificado";

  return Number(value).toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
  });
}