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
      aprobadosRrhh: postulacionesVacante.filter(
        (item) => item.estado === "APROBADO_RRHH"
      ).length,
      enEvaluacion: postulacionesVacante.filter((item) =>
        ["EVALUACION_PENDIENTE", "EVALUACION_COMPLETADA"].includes(item.estado)
      ).length,
      completadas: asignacionesVacante.filter(
        (item) => item.estado === "COMPLETADA"
      ).length,
      aptosTecnicos: postulacionesVacante.filter(
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
        const matchesSearch =
          vacante.titulo?.toLowerCase().includes(value) ||
          vacante.areaNombre?.toLowerCase().includes(value) ||
          vacante.estado?.toLowerCase().includes(value);

        const matchesStatus =
          selectedStatus === "Todos" || vacante.estado === selectedStatus;

        return matchesSearch && matchesStatus;
      });
  }, [vacantes, search, selectedStatus]);

  const activeProcesses = vacantes.filter(
    (item) => item.estado === "ACTIVA" || item.estado === "EN_PROCESO"
  ).length;

  const closedProcesses = vacantes.filter(
    (item) => item.estado === "CERRADA"
  ).length;

  const totalPendingRrhhApproved = postulaciones.filter(
    (item) => item.estado === "APROBADO_RRHH"
  ).length;

  const statusClass = (status) => {
    const styles = {
      ACTIVA: "bg-sky-50 text-sky-700 border-sky-200",
      EN_PROCESO: "bg-amber-50 text-amber-700 border-amber-200",
      CERRADA: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };

    return styles[status] || "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <div>
      <SectionHeader
        title="Procesos técnicos"
        description="Selecciona una vacante para revisar candidatos, asignar evaluaciones y controlar el avance técnico."
      />

      {message && (
        <div className="mb-5 border border-rose-200 bg-rose-50 text-rose-700 rounded-3xl px-5 py-4 font-semibold">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">
            Procesos activos
          </p>
          <p className="text-4xl font-black text-sky-600 mt-2">
            {activeProcesses}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">
            Listos para evaluación
          </p>
          <p className="text-4xl font-black text-emerald-600 mt-2">
            {totalPendingRrhhApproved}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-semibold">
            Procesos cerrados
          </p>
          <p className="text-4xl font-black text-slate-900 mt-2">
            {closedProcesses}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] p-5 mb-8 grid grid-cols-1 md:grid-cols-[1fr_240px_auto] gap-4 shadow-sm">
        <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100">
          <Search size={18} className="text-emerald-600" />
          <input
            type="text"
            placeholder="Buscar por vacante, área o estado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent text-slate-900"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="input-light"
        >
          <option value="Todos">Todos los estados</option>
          <option value="ACTIVA">Activa</option>
          <option value="EN_PROCESO">En proceso</option>
          <option value="CERRADA">Cerrada</option>
        </select>

        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-2xl font-black"
        >
          <RefreshCw size={18} />
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-900">
            Cargando procesos...
          </h2>
          <p className="text-slate-500 mt-2">
            Consultando vacantes, postulaciones y evaluaciones.
          </p>
        </div>
      ) : procesos.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center shadow-sm">
          <Briefcase size={42} className="mx-auto text-emerald-600" />
          <h2 className="text-2xl font-black text-slate-900 mt-4">
            No hay procesos técnicos
          </h2>
          <p className="text-slate-500 mt-2">
            Cuando existan vacantes activas o en proceso, aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {procesos.map((vacante) => {
            const stats = getStatsByVacante(vacante.id);

            return (
              <article
                key={vacante.id}
                className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                  <div>
                    <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black mb-3">
                      {vacante.areaNombre}
                    </span>

                    <h3 className="text-2xl font-black text-slate-900">
                      {vacante.titulo}
                    </h3>

                    <p className="text-slate-500 mt-2 line-clamp-2">
                      {vacante.descripcion}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center justify-center px-4 py-2 rounded-full border text-sm font-black ${statusClass(
                      vacante.estado
                    )}`}
                  >
                    {vacante.estado}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-6">
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <Users size={19} className="text-emerald-600" />
                    <p className="text-xl font-black text-slate-900 mt-2">
                      {stats.postulantes}
                    </p>
                    <p className="text-xs text-slate-500">Postulantes</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <CheckCircle2 size={19} className="text-emerald-600" />
                    <p className="text-xl font-black text-slate-900 mt-2">
                      {stats.aprobadosRrhh}
                    </p>
                    <p className="text-xs text-slate-500">Aprobados RRHH</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <FileQuestion size={19} className="text-emerald-600" />
                    <p className="text-xl font-black text-slate-900 mt-2">
                      {stats.evaluaciones}
                    </p>
                    <p className="text-xs text-slate-500">Evaluaciones</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <Clock size={19} className="text-emerald-600" />
                    <p className="text-xl font-black text-slate-900 mt-2">
                      {stats.enEvaluacion}
                    </p>
                    <p className="text-xs text-slate-500">En evaluación</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <CheckCircle2 size={19} className="text-emerald-600" />
                    <p className="text-xl font-black text-slate-900 mt-2">
                      {stats.aptosTecnicos}
                    </p>
                    <p className="text-xs text-slate-500">Aptos técnicos</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <Trophy size={19} className="text-amber-600" />
                    <p className="text-xl font-black text-slate-900 mt-2">
                      {stats.seleccionados}
                    </p>
                    <p className="text-xs text-slate-500">Seleccionado</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Link
                    to={`/technical/vacantes/${vacante.id}`}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white px-5 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20"
                  >
                    <Briefcase size={18} />
                    Ver proceso
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TechnicalJobs;