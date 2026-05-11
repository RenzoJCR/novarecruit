import { Calendar, MapPin, Briefcase, Coins } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

function JobCard({
  job,
  onViewDetail,
  onApply,
  showApplyButton = true,
  detailLabel = "Ver detalle",
}) {
  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600 mb-2">
            {job.area}
          </p>

          <h3 className="text-xl font-bold text-slate-900">
            {job.title}
          </h3>
        </div>

        <StatusBadge status={job.status} />
      </div>

      <p className="text-slate-600 mt-4 line-clamp-2">
        {job.description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Briefcase size={17} className="text-blue-600" />
          {job.modality}
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={17} className="text-blue-600" />
          {job.location}
        </div>

        <div className="flex items-center gap-2">
          <Coins size={17} className="text-blue-600" />
          {job.salary}
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={17} className="text-blue-600" />
          Cierre: {job.closingDate}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        {job.skills.map((skill) => (
          <span
            key={`${job.id}-${skill.name}`}
            className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
          >
            {skill.name} · {skill.level}
          </span>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={() => onViewDetail?.(job)}
          className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl font-semibold"
        >
          {detailLabel}
        </button>

        {showApplyButton && (
          <button
            type="button"
            onClick={() => onApply?.(job)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold"
          >
            Postular
          </button>
        )}
      </div>
    </article>
  );
}

export default JobCard;