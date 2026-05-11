function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>

          <h3 className="text-4xl font-black text-slate-900 mt-2">
            {value}
          </h3>

          {description && (
            <p className="text-sm text-slate-500 mt-2">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center border border-white">
            <Icon size={25} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;