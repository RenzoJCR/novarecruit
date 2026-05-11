function PagePlaceholder({ title, description }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <p className="text-sm font-semibold text-blue-600 uppercase mb-2">
        NovaRecruit
      </p>

      <h1 className="text-3xl font-bold text-slate-900 mb-3">
        {title}
      </h1>

      <p className="text-slate-600 max-w-2xl">
        {description}
      </p>
    </section>
  );
}

export default PagePlaceholder;