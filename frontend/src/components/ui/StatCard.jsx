function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h3 className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </h3>

          {description && (
            <p className="text-sm text-slate-500 mt-2">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;