import { Calendar, ExternalLink } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

function ApplicationCard({ application }) {
  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600 mb-2">
            {application.area}
          </p>

          <h3 className="text-xl font-bold text-slate-900">
            {application.jobTitle}
          </h3>

          <p className="text-slate-500 mt-1">
            Candidato: {application.candidate}
          </p>
        </div>

        <StatusBadge status={application.status} />
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-500 mt-4">
        <Calendar size={17} />
        Postulación enviada: {application.appliedAt}
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        {application.skills.map((skill) => (
          <span
            key={`${application.id}-${skill.name}`}
            className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
          >
            {skill.name} · {skill.level} · {skill.years} año(s)
          </span>
        ))}
      </div>

      <a
        href={application.cvUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 mt-5 text-blue-600 font-semibold text-sm"
      >
        Ver CV
        <ExternalLink size={16} />
      </a>
    </article>
  );
}

export default ApplicationCard;