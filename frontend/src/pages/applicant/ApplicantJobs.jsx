import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { areas } from "../../data/areas.js";
import JobCard from "../../components/ui/JobCard.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { useData } from "../../context/DataContext.jsx";

function ApplicantJobs() {
  const navigate = useNavigate();
  const { jobs, applyToJob } = useData();

  const [selectedArea, setSelectedArea] = useState("Todas");
  const [selectedModality, setSelectedModality] = useState("Todas");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesArea =
        selectedArea === "Todas" || job.area === selectedArea;

      const matchesModality =
        selectedModality === "Todas" || job.modality === selectedModality;

      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase());

      return matchesArea && matchesModality && matchesSearch;
    });
  }, [jobs, selectedArea, selectedModality, search]);

  const handleApply = (job) => {
    const result = applyToJob(job);
    setMessage(result.message);

    if (result.ok) {
      setTimeout(() => {
        navigate("/applicant/postulaciones");
      }, 700);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Vacantes disponibles"
        description="Explora las oportunidades activas y postula a las que se ajusten a tu perfil."
      />

      {message && (
        <div className="mb-5 bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl px-5 py-4 font-medium">
          {message}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Buscar por puesto o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:col-span-2 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
        />

        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="Todas">Todas las áreas</option>
          {areas.map((area) => (
            <option key={area.id} value={area.name}>
              {area.name}
            </option>
          ))}
        </select>

        <select
          value={selectedModality}
          onChange={(e) => setSelectedModality(e.target.value)}
          className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="Todas">Todas las modalidades</option>
          <option value="Remoto">Remoto</option>
          <option value="Híbrido">Híbrido</option>
          <option value="Presencial">Presencial</option>
        </select>
      </div>

      <div className="mb-4">
        <p className="text-slate-500">
          Resultados encontrados:{" "}
          <span className="font-bold text-slate-900">
            {filteredJobs.length}
          </span>
        </p>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            No se encontraron vacantes
          </h2>
          <p className="text-slate-500 mt-2">
            Prueba con otra búsqueda o cambia los filtros.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApply={handleApply}
              onViewDetail={() => navigate("/applicant/vacantes")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ApplicantJobs;