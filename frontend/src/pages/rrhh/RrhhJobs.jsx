import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import JobCard from "../../components/ui/JobCard.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { useData } from "../../context/DataContext.jsx";

function RrhhJobs() {
  const navigate = useNavigate();
  const { jobs } = useData();

  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) =>
      job.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [jobs, search]);

  return (
    <div>
      <SectionHeader
        title="Gestión de vacantes"
        description="Administra las vacantes publicadas por Recursos Humanos."
        action={
          <button
            onClick={() => navigate("/rrhh/vacantes/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
          >
            Crear nueva vacante
          </button>
        }
      />

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8">
        <input
          type="text"
          placeholder="Buscar vacante..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default RrhhJobs;