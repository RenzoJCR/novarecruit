function SectionHeader({ title, description, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
      <div>
        <p className="text-sm font-bold text-emerald-600 uppercase tracking-wide mb-2">
          NovaRecruit
        </p>

        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="text-slate-500 mt-2 max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}

export default SectionHeader;