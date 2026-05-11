function SectionHeader({ title, description, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {title}
        </h1>

        {description && (
          <p className="text-slate-500 mt-2">
            {description}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}

export default SectionHeader;