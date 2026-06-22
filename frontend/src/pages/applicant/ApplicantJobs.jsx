import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  Eye,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { vacanteService } from "../../services/vacanteService.js";

function formatDate(value) {
  if (!value) return "Sin fecha";

  return new Date(`${value}T00:00:00`).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function formatMoney(value) {
  if (value === null || value === undefined) return "No especificado";

  return Number(value).toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
  });
}

function modalidadClass(modalidad) {
  const styles = {
    REMOTO: "bg-sky-50 text-sky-700 border-sky-200",
    HIBRIDO: "bg-amber-50 text-amber-700 border-amber-200",
    PRESENCIAL: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return styles[modalidad] || "bg-slate-50 text-slate-600 border-slate-200";
}

function ApplicantJobs() {
  const [vacantes, setVacantes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMode, setSelectedMode] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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

  const filteredVacantes = useMemo(() => {
    const value = search.toLowerCase().trim();

    return vacantes.filter((vacante) => {
      const matchesSearch =
        vacante.titulo?.toLowerCase().includes(value) ||
        vacante.areaNombre?.toLowerCase().includes(value) ||
        vacante.descripcion?.toLowerCase().includes(value) ||
        vacante.ubicacion?.toLowerCase().includes(value);

      const matchesMode =
        selectedMode === "Todos" || vacante.modalidad === selectedMode;

      return matchesSearch && matchesMode;
    });
  }, [vacantes, search, selectedMode]);

  const remoto = vacantes.filter((item) => item.modalidad === "REMOTO").length;
  const hibrido = vacantes.filter((item) => item.modalidad === "HIBRIDO").length;
  const presencial = vacantes.filter(
    (item) => item.modalidad === "PRESENCIAL"
  ).length;

  return (
    <div>
      <SectionHeader
        title="Vacantes disponibles"
        description="Explora oportunidades laborales y postula a las que se ajusten a tu perfil."
      />

      {message && (
        <div className="mb-5 border border-rose-200 bg-rose-50 text-rose-700 rounded-2xl px-4 py-3 text-sm font-semibold">
          {message}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Remotas</p>
          <p className="text-3xl font-black text-sky-600 mt-1">{remoto}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Híbridas</p>
          <p className="text-3xl font-black text-amber-600 mt-1">{hibrido}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Presenciales</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">
            {presencial}
          </p>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3">
        <div className="flex items-center gap-3 border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100">
          <Search size={18} className="text-sky-600" />
          <input
            type="text"
            placeholder="Buscar por puesto, área o ubicación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-sm text-slate-900"
          />
        </div>

        <select
          value={selectedMode}
          onChange={(e) => setSelectedMode(e.target.value)}
          className="input-light"
        >
          <option value="Todos">Todas</option>
          <option value="REMOTO">Remoto</option>
          <option value="HIBRIDO">Híbrido</option>
          <option value="PRESENCIAL">Presencial</option>
        </select>

        <button
          type="button"
          onClick={loadVacantes}
          className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-black"
        >
          <RefreshCw size={17} />
          Actualizar
        </button>
      </section>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-black text-slate-900">
            Cargando vacantes...
          </h2>
          <p className="text-slate-500 mt-1">Un momento por favor.</p>
        </div>
      ) : filteredVacantes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <Briefcase size={36} className="mx-auto text-sky-600" />
          <h2 className="text-xl font-black text-slate-900 mt-3">
            No hay vacantes disponibles
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Intenta ajustar los filtros o vuelve más tarde.
          </p>
        </div>
      ) : (
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1.4fr_1fr_0.9fr_0.8fr_150px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase">
            <span>Vacante</span>
            <span>Área</span>
            <span>Modalidad</span>
            <span>Cierre</span>
            <span className="text-right">Acción</span>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredVacantes.map((vacante) => (
              <div
                key={vacante.id}
                className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_0.9fr_0.8fr_150px] gap-4 px-5 py-4 items-center"
              >
                <div>
                  <p className="font-black text-slate-900">{vacante.titulo}</p>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {vacante.descripcion}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Salario: {formatMoney(vacante.salario)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {vacante.areaNombre}
                  </p>
                  <p className="text-xs text-slate-500">
                    {vacante.nivelExperiencia}
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${modalidadClass(
                      vacante.modalidad
                    )}`}
                  >
                    {vacante.modalidad}
                  </span>
                  <p className="text-xs text-slate-500 mt-2 inline-flex items-center gap-1">
                    <MapPin size={13} />
                    {vacante.ubicacion || "Sin ubicación"}
                  </p>
                </div>

                <div>
                  <p className="inline-flex items-center gap-1 text-sm text-slate-600">
                    <Calendar size={15} />
                    {formatDate(vacante.fechaCierre)}
                  </p>
                </div>

                <div className="flex justify-start lg:justify-end">
                  <Link
                    to={`/applicant/vacantes/${vacante.id}`}
                    className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-xl text-sm font-bold"
                  >
                    <Eye size={16} />
                    Ver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ApplicantJobs;