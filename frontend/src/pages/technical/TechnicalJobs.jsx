import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  FileQuestion,
  RefreshCw,
  Search,
  Trophy,
  Users,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { vacanteService } from "../../services/vacanteService.js";
import { postulacionService } from "../../services/postulacionService.js";
import { evaluacionService } from "../../services/evaluacionService.js";
import { evaluacionPostulacionService } from "../../services/evaluacionPostulacionService.js";
import {
  getVacanteEstadoLabel,
  statusClass,
} from "../../utils/statusLabels.js";

function TechnicalJobs() {
  const [vacantes, setVacantes] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        vacantesData,
        postulacionesData,
        evaluacionesData,
        asignacionesData,
      ] = await Promise.all([
        vacanteService.getAll(),
        postulacionService.getAll(),
        evaluacionService.getAll(),
        evaluacionPostulacionService.getAll(),
      ]);

      setVacantes(vacantesData);
      setPostulaciones(postulacionesData);
      setEvaluaciones(evaluacionesData);
      setAsignaciones(asignacionesData);
      setMessage("");
    } catch (error) {
      setMessage(
        error.userMessage || "No se pudieron cargar los procesos técnicos."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatsByVacante = (vacanteId) => {
    const postulacionesVacante = postulaciones.filter(
      (item) => Number(item.vacanteId) === Number(vacanteId)
    );

    const evaluacionesVacante = evaluaciones.filter(
      (item) => Number(item.vacanteId) === Number(vacanteId)
    );

    const asignacionesVacante = asignaciones.filter(
      (item) => Number(item.vacanteId) === Number(vacanteId)
    );

    return {
      postulantes: postulacionesVacante.length,
      listos: postulacionesVacante.filter(
        (item) => item.estado === "APROBADO_RRHH"
      ).length,
      enEvaluacion: postulacionesVacante.filter((item) =>
        ["EVALUACION_PENDIENTE", "EVALUACION_COMPLETADA"].includes(item.estado)
      ).length,
      porRevisar: asignacionesVacante.filter(
        (item) => item.estado === "COMPLETADA"
      ).length,
      aptos: postulacionesVacante.filter(
        (item) => item.estado === "APROBADO_TECNICO"
      ).length,
      seleccionados: postulacionesVacante.filter(
        (item) => item.estado === "SELECCIONADO"
      ).length,
      evaluaciones: evaluacionesVacante.length,
    };
  };

  const procesos = useMemo(() => {
    const value = search.toLowerCase().trim();

    return vacantes
      .filter((vacante) => vacante.estado !== "CANCELADA")
      .filter((vacante) => {
        const estadoVisible = getVacanteEstadoLabel(
          vacante.estado
        ).toLowerCase();

        const matchesSearch =
          vacante.titulo?.toLowerCase().includes(value) ||
          vacante.areaNombre?.toLowerCase().includes(value) ||
          estadoVisible.includes(value);

        const matchesStatus =
          selectedStatus === "Todos" || vacante.estado === selectedStatus;

        return matchesSearch && matchesStatus;
      });
  }, [vacantes, search, selectedStatus]);

  const procesosActivos = vacantes.filter((item) =>
    ["ACTIVA", "EN_PROCESO"].includes(item.estado)
  ).length;

  const listosEvaluacion = postulaciones.filter(
    (item) => item.estado === "APROBADO_RRHH"
  ).length;

  const porRevisar = asignaciones.filter(
    (item) => item.estado === "COMPLETADA"
  ).length;

  return (
    <div>
      <SectionHeader
        title="Procesos técnicos"
        description="Selecciona una vacante para asignar evaluaciones, revisar resultados y elegir ganador."
      />

      {message && (
        <div className="mb-5 border border-rose-200 bg-rose-50 text-rose-700 rounded-2xl px-4 py-3 text-sm font-semibold">
          {message}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">
            Procesos activos
          </p>
          <p className="text-3xl font-black text-emerald-600 mt-1">
            {procesosActivos}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">
            Listos para evaluación
          </p>
          <p className="text-3xl font-black text-sky-600 mt-1">
            {listosEvaluacion}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Por revisar</p>
          <p className="text-3xl font-black text-violet-600 mt-1">
            {porRevisar}
          </p>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-[1fr_230px_auto] gap-3">
        <div className="flex items-center gap-3 border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
          <Search size={18} className="text-emerald-600" />

          <input
            type="text"
            placeholder="Buscar por vacante, área o estado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-sm text-slate-900"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="input-light"
        >
          <option value="Todos">Todos</option>
          <option value="ACTIVA">Activa</option>
          <option value="EN_PROCESO">En proceso</option>
          <option value="CERRADA">Cerrada</option>
        </select>

        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-black"
        >
          <RefreshCw size={17} />
          Actualizar
        </button>
      </section>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-black text-slate-900">
            Cargando procesos...
          </h2>
        </div>
      ) : procesos.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <Briefcase size={36} className="mx-auto text-emerald-600" />

          <h2 className="text-xl font-black text-slate-900 mt-3">
            No hay procesos técnicos
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Cuando existan vacantes activas o en proceso aparecerán aquí.
          </p>
        </div>
      ) : (
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr_0.8fr_140px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase">
            <span>Vacante</span>
            <span>Listos</span>
            <span>Evaluaciones</span>
            <span>Por revisar</span>
            <span>Estado</span>
            <span className="text-right">Acción</span>
          </div>

          <div className="divide-y divide-slate-200">
            {procesos.map((vacante) => {
              const stats = getStatsByVacante(vacante.id);

              return (
                <div
                  key={vacante.id}
                  className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr_0.8fr_140px] gap-4 px-5 py-4 items-center"
                >
                  <div>
                    <p className="font-black text-slate-900">
                      {vacante.titulo}
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      {vacante.areaNombre} · {stats.postulantes} candidato(s)
                    </p>

                    {stats.seleccionados > 0 && (
                      <p className="text-xs text-amber-700 font-black mt-1">
                        Ganador seleccionado
                      </p>
                    )}
                  </div>

                  <p className="inline-flex items-center gap-1 text-sm font-black text-slate-700">
                    <Users size={15} className="text-emerald-600" />
                    {stats.listos}
                  </p>

                  <p className="inline-flex items-center gap-1 text-sm font-black text-slate-700">
                    <FileQuestion size={15} className="text-emerald-600" />
                    {stats.evaluaciones}
                  </p>

                  <p className="inline-flex items-center gap-1 text-sm font-black text-slate-700">
                    <Clock size={15} className="text-violet-600" />
                    {stats.porRevisar}
                  </p>

                  <div>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${statusClass(
                        vacante.estado
                      )}`}
                    >
                      {getVacanteEstadoLabel(vacante.estado)}
                    </span>
                  </div>

                  <div className="flex justify-start lg:justify-end">
                    <Link
                      to={`/technical/vacantes/${vacante.id}`}
                      className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-black"
                    >
                      <CheckCircle2 size={16} />
                      Ver proceso
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default TechnicalJobs;