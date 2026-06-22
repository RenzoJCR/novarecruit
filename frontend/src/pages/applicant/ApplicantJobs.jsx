import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { vacanteService } from "../../services/vacanteService.js";

function ApplicantJobs() {
  const [vacantes, setVacantes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const areas = useMemo(() => {
    const areaNames = vacantes.map((vacante) => vacante.areaNombre).filter(Boolean);
    return ["Todas", ...new Set(areaNames)];
  }, [vacantes]);

  const filteredVacantes = useMemo(() => {
    const value = search.toLowerCase().trim();

    return vacantes.filter((vacante) => {
      const matchesSearch =
        vacante.titulo?.toLowerCase().includes(value) ||
        vacante.descripcion?.toLowerCase().includes(value) ||
        vacante.areaNombre?.toLowerCase().includes(value);

      const matchesArea =
        selectedArea === "Todas" || vacante.areaNombre === selectedArea;

      return matchesSearch && matchesArea;
    });
  }, [vacantes, search, selectedArea]);

  const loadVacantes = async () => {
    try {
      setLoading(true);
      const data = await vacanteService.getActive();
      setVacantes(data);
    } catch (error) {
      setMessage(error.userMessage || "No se pudieron cargar las vacantes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVacantes();
  }, []);

  const formatDate = (value) => {
    if (!value) return "Sin fecha";

    return new Date(`${value}T00:00:00`).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined) return "No especificado";

    return Number(value).toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
    });
  };

  return (
    <div>
      <SectionHeader
        title="Vacantes disponibles"
        description="Explora oportunidades laborales activas y postula desde NovaRecruit."
      />

      {message && (
        <div className="mb-5 border border-rose-200 bg-rose-50 text-rose-700 rounded-3xl px-5 py-4 font-semibold">
          {message}
        </div>
      )}

      <div className="bg-white/95 border border-slate-200 rounded-[2rem] p-5 mb-8 grid grid-cols-1 md:grid-cols-[1fr_240px_auto] gap-4 shadow-sm">
        <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
          <Search size={18} className="text-emerald-600" />
          <input
            type="text"
            placeholder="Buscar por puesto, descripción o área..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-slate-900"
          />
        </div>

        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="input-light"
        >
          {areas.map((area) => (
            <option key={area} value={area}>
              {area === "Todas" ? "Todas las áreas" : area}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={loadVacantes}
          className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-2xl font-black"
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
          <h2 className="text-2xl font-black text-slate-900">
            Cargando vacantes...
          </h2>
          <p className="text-slate-500 mt-2">
            Consultando información desde MySQL.
          </p>
        </div>
      ) : filteredVacantes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
          <h2 className="text-2xl font-black text-slate-900">
            No hay vacantes disponibles
          </h2>
          <p className="text-slate-500 mt-2">
            Intenta cambiar los filtros o revisa más tarde.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredVacantes.map((vacante) => (
            <article
              key={vacante.id}
              className="bg-white/95 border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black mb-3">
                    {vacante.areaNombre}
                  </span>

                  <h3 className="text-2xl font-black text-slate-900">
                    {vacante.titulo}
                  </h3>

                  <p className="text-slate-500 mt-3 leading-relaxed line-clamp-3">
                    {vacante.descripcion}
                  </p>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Briefcase size={24} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin size={17} className="text-emerald-600" />
                  {vacante.modalidad} · {vacante.ubicacion || "Sin ubicación"}
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign size={17} className="text-emerald-600" />
                  {formatMoney(vacante.salario)}
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={17} className="text-emerald-600" />
                  Cierre: {formatDate(vacante.fechaCierre)}
                </div>

                <div className="flex items-center gap-2">
                  <Sparkles size={17} className="text-emerald-600" />
                  {vacante.nivelExperiencia}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {vacante.habilidades?.slice(0, 4).map((item) => (
                  <span
                    key={item.id}
                    className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold"
                  >
                    {item.habilidadNombre}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  to={`/applicant/vacantes/${vacante.id}`}
                  className="inline-flex items-center justify-center w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white px-5 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20"
                >
                  Ver detalle y postular
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApplicantJobs;