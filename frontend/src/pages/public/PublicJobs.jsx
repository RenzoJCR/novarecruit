import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";

import { jobs } from "../../data/jobs.js";
import { areas } from "../../data/areas.js";
import JobCard from "../../components/ui/JobCard.jsx";

function PublicJobs() {
  const navigate = useNavigate();

  const [selectedArea, setSelectedArea] = useState("Todas");
  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesArea =
        selectedArea === "Todas" || job.area === selectedArea;

      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase());

      return matchesArea && matchesSearch;
    });
  }, [selectedArea, search]);

  return (
    <section className="px-8 py-14 max-w-7xl mx-auto">
      <div className="mb-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-end">
        <div>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-300/20 text-emerald-300 text-sm font-bold mb-5">
            <SlidersHorizontal size={16} />
            Oportunidades disponibles
          </span>

          <h1 className="text-4xl lg:text-6xl font-black tracking-tight">
            Vacantes en <span className="gradient-text">NovaTech Solutions</span>
          </h1>

          <p className="text-slate-400 mt-5 max-w-2xl leading-relaxed">
            Explora oportunidades tecnológicas por área. Para postular deberás
            iniciar sesión o crear una cuenta como postulante.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-5">
          <p className="text-sm text-slate-400">Vacantes encontradas</p>
          <p className="text-5xl font-black gradient-text mt-1">
            {filteredJobs.length}
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Filtradas según tu búsqueda.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-5 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 flex items-center gap-3 bg-slate-950/80 border border-white/10 rounded-2xl px-4 py-3">
          <Search size={19} className="text-emerald-300" />
          <input
            type="text"
            placeholder="Buscar por puesto o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
          />
        </div>

        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="input-dark"
        >
          <option value="Todas">Todas las áreas</option>
          {areas.map((area) => (
            <option key={area.id} value={area.name}>
              {area.name}
            </option>
          ))}
        </select>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-black">No se encontraron vacantes</h2>

          <p className="text-slate-400 mt-3">
            Intenta con otra búsqueda o cambia el área seleccionada.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-slate-900">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              showApplyButton={false}
              detailLabel="Ver detalle"
              onViewDetail={(selectedJob) =>
                navigate(`/vacantes/${selectedJob.id}`)
              }
            />
          ))}
        </div>
      )}

      <div className="mt-12 glass-card rounded-3xl p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <h2 className="text-2xl font-black">¿Quieres postular?</h2>

          <p className="text-slate-400 mt-2">
            Crea tu cuenta para registrar tu perfil, agregar tu CV y participar
            en el proceso de selección.
          </p>
        </div>

        <Link
          to="/register"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20"
        >
          Crear cuenta
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

export default PublicJobs;