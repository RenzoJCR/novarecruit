import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

      const matchesSearch = job.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesArea && matchesSearch;
    });
  }, [selectedArea, search]);

  return (
    <section className="px-8 py-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <span className="text-blue-400 font-semibold text-sm">
          Oportunidades disponibles
        </span>

        <h1 className="text-4xl font-bold mt-2">
          Vacantes en NovaTech Solutions
        </h1>

        <p className="text-slate-400 mt-3 max-w-2xl">
          Explora las vacantes disponibles por área. Para postular deberás
          iniciar sesión o crear una cuenta como postulante.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Buscar vacante..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:col-span-2 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
        />

        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
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
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold">No se encontraron vacantes</h2>

          <p className="text-slate-400 mt-2">
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

      <div className="mt-10 bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">¿Quieres postular?</h2>

          <p className="text-slate-300 mt-1">
            Crea tu cuenta para registrar tu perfil, subir tu CV y participar en
            el proceso.
          </p>
        </div>

        <Link
          to="/register"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-center"
        >
          Crear cuenta
        </Link>
      </div>
    </section>
  );
}

export default PublicJobs;