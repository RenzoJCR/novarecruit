import { Calendar, MapPin, Briefcase, Coins, ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

function JobCard({
  job,
  onViewDetail,
  onApply,
  showApplyButton = true,
  detailLabel = "Ver detalle",
}) {
  return (
    <article className="group bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-sky-100 rounded-full blur-2xl opacity-60 translate-x-10 -translate-y-10 group-hover:opacity-90 transition-opacity" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold mb-3">
              {job.area}
            </p>

            <h3 className="text-xl font-black text-slate-900 leading-snug">
              {job.title}
            </h3>
          </div>

          <StatusBadge status={job.status} />
        </div>

        <p className="text-slate-600 mt-4 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 text-sm text-slate-600">
          <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-3 py-2 border border-slate-100">
            <Briefcase size={17} className="text-emerald-600" />
            {job.modality}
          </div>

          <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-3 py-2 border border-slate-100">
            <MapPin size={17} className="text-emerald-600" />
            {job.location}
          </div>

          <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-3 py-2 border border-slate-100">
            <Coins size={17} className="text-emerald-600" />
            {job.salary}
          </div>

          <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-3 py-2 border border-slate-100">
            <Calendar size={17} className="text-emerald-600" />
            Cierre: {job.closingDate}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {job.skills.map((skill) => (
            <span
              key={`${job.id}-${skill.name}`}
              className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
            >
              {skill.name} · {skill.level}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            type="button"
            onClick={() => onViewDetail?.(job)}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 py-2.5 rounded-2xl font-bold transition-colors"
          >
            {detailLabel}
            <ArrowRight size={17} />
          </button>

          {showApplyButton && (
            <button
              type="button"
              onClick={() => onApply?.(job)}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white py-2.5 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all"
            >
              Postular
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default JobCard;