import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  FileText,
  Plus,
  Sparkles,
  CheckCircle2,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  Save,
  Activity,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { areaService } from "../../services/areaService.js";
import { logService } from "../../services/logService.js";

const initialForm = {
  nombre: "",
  descripcion: "",
  estado: true,
};

const inputWithIconClass =
  "w-full border border-slate-300 rounded-xl py-3 pr-4 pl-12 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

function AdminAreas() {
  const [areas, setAreas] = useState([]);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingAreaId, setEditingAreaId] = useState(null);

  const [search, setSearch] = useState("");
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const filteredAreas = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return areas;

    return areas.filter((area) => {
      return (
        area.nombre?.toLowerCase().includes(value) ||
        area.descripcion?.toLowerCase().includes(value)
      );
    });
  }, [areas, search]);

  const activeAreasCount = areas.filter((area) => area.estado).length;

  const loadAreas = async () => {
    try {
      setLoadingAreas(true);
      const data = await areaService.getAll();
      setAreas(data);
    } catch (error) {
      showMessage(error.userMessage || "No se pudieron cargar las áreas.", "error");
    } finally {
      setLoadingAreas(false);
    }
  };

  const loadLogs = async () => {
    try {
      setLoadingLogs(true);
      const data = await logService.getLatest();
      setLogs(data.slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const refreshData = async () => {
    await Promise.all([loadAreas(), loadLogs()]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 3500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingAreaId(null);
  };

  const handleEdit = (area) => {
    setEditingAreaId(area.id);
    setForm({
      nombre: area.nombre || "",
      descripcion: area.descripcion || "",
      estado: Boolean(area.estado),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const validateForm = () => {
    if (!form.nombre.trim()) {
      return "Ingresa el nombre del área.";
    }

    if (form.nombre.trim().length < 3) {
      return "El nombre del área debe tener al menos 3 caracteres.";
    }

    if (!form.descripcion.trim()) {
      return "Ingresa la descripción del área.";
    }

    if (form.descripcion.trim().length < 10) {
      return "La descripción debe tener al menos 10 caracteres.";
    }

    if (form.descripcion.trim().length > 255) {
      return "La descripción no debe superar los 255 caracteres.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      showMessage(validationError, "error");
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      estado: form.estado,
    };

    try {
      setSaving(true);

      if (editingAreaId) {
        await areaService.update(editingAreaId, payload);
        showMessage("Área actualizada correctamente.", "success");
      } else {
        await areaService.create(payload);
        showMessage("Área creada correctamente.", "success");
      }

      resetForm();
      await refreshData();
    } catch (error) {
      showMessage(error.userMessage || "No se pudo guardar el área.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (area) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas desactivar el área "${area.nombre}"?`
    );

    if (!confirmed) return;

    try {
      await areaService.deactivate(area.id);
      showMessage("Área desactivada correctamente.", "success");
      await refreshData();
    } catch (error) {
      showMessage(error.userMessage || "No se pudo desactivar el área.", "error");
    }
  };

  const formatDate = (value) => {
    if (!value) return "Sin fecha";

    return new Date(value).toLocaleString("es-PE", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div>
      <SectionHeader
        title="Gestión de áreas"
        description="Administra las áreas internas usadas para clasificar vacantes, postulantes y evaluaciones técnicas."
      />

      {message && (
        <div
          className={`mb-5 border rounded-3xl px-5 py-4 font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[390px_1fr] gap-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-7 shadow-sm h-fit"
        >
          <div className="flex items-center gap-3 mb-7">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center">
              <Building2 size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {editingAreaId ? "Editar área" : "Nueva área"}
              </h2>
              <p className="text-sm text-slate-500">
                {editingAreaId
                  ? "Actualiza los datos del área seleccionada."
                  : "Registra una categoría para las vacantes."}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Nombre del área *
              </label>

              <div className="relative">
                <Building2
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                />

                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Data Analytics"
                  className={inputWithIconClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Descripción *
              </label>

              <div className="relative">
                <FileText
                  size={18}
                  className="absolute left-4 top-5 text-emerald-600 pointer-events-none"
                />

                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Describe el objetivo del área..."
                  className="w-full min-h-36 border border-slate-300 rounded-xl py-3 pr-4 pl-12 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer">
              <input
                type="checkbox"
                name="estado"
                checked={form.estado}
                onChange={handleChange}
                className="accent-emerald-500"
              />
              <div>
                <p className="font-black text-slate-900">Área activa</p>
                <p className="text-sm text-slate-500">
                  Las áreas activas podrán usarse en vacantes.
                </p>
              </div>
            </label>

            <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-sky-50 border border-emerald-100 p-5">
              <div className="flex items-start gap-3">
                <Sparkles
                  size={22}
                  className="text-emerald-600 shrink-0 mt-1"
                />

                <div>
                  <h3 className="font-black text-slate-900">
                    Datos reales desde MySQL
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Esta pantalla ya consume el backend de Spring Boot mediante
                    JPA y guarda los cambios en MySQL.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 disabled:from-slate-300 disabled:to-slate-300 text-white py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20 disabled:shadow-none"
              >
                {editingAreaId ? <Save size={18} /> : <Plus size={18} />}
                {saving
                  ? "Guardando..."
                  : editingAreaId
                  ? "Actualizar área"
                  : "Crear área"}
              </button>

              {editingAreaId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 py-3 rounded-2xl font-black"
                >
                  <X size={18} />
                  Cancelar edición
                </button>
              )}
            </div>
          </div>
        </form>

        <section className="space-y-6">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-7 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Áreas registradas
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {areas.length} área(s) registradas · {activeAreasCount} activa(s)
                </p>
              </div>

              <button
                type="button"
                onClick={refreshData}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-sm font-bold hover:bg-emerald-100"
              >
                <RefreshCw size={17} />
                Actualizar
              </button>
            </div>

            <div className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 bg-white focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100 mb-6">
              <Search size={18} className="text-emerald-600" />
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none bg-transparent text-slate-900"
              />
            </div>

            {loadingAreas ? (
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 text-center">
                <p className="font-black text-slate-900">Cargando áreas...</p>
                <p className="text-slate-500 mt-2">
                  Consultando información desde el backend.
                </p>
              </div>
            ) : filteredAreas.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 text-center">
                <h3 className="text-xl font-black text-slate-900">
                  No hay áreas para mostrar
                </h3>
                <p className="text-slate-500 mt-2">
                  Crea una nueva área o cambia el filtro de búsqueda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredAreas.map((area) => (
                  <article
                    key={area.id}
                    className={`group relative overflow-hidden border rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all ${
                      area.estado
                        ? "bg-slate-50 border-slate-200"
                        : "bg-slate-100 border-slate-200 opacity-70"
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-emerald-100 to-sky-100 rounded-full blur-2xl opacity-60 translate-x-8 -translate-y-8 group-hover:opacity-90 transition-opacity" />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-emerald-700 flex items-center justify-center mb-5">
                          <Building2 size={23} />
                        </div>

                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
                            area.estado
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              area.estado ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          {area.estado ? "Activa" : "Inactiva"}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-slate-900">
                        {area.nombre}
                      </h3>

                      <p className="text-slate-500 mt-3 leading-relaxed">
                        {area.descripcion}
                      </p>

                      <p className="text-xs text-slate-400 mt-4">
                        Creada: {formatDate(area.createdAt)}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 mt-5">
                        <button
                          type="button"
                          onClick={() => handleEdit(area)}
                          className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-white text-slate-700 px-4 py-2 rounded-2xl font-black"
                        >
                          <Pencil size={17} />
                          Editar
                        </button>

                        {area.estado && (
                          <button
                            type="button"
                            onClick={() => handleDeactivate(area)}
                            className="inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 px-4 py-2 rounded-2xl font-black"
                          >
                            <Trash2 size={17} />
                            Desactivar
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center">
                <Activity size={24} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Actividad reciente
                </h2>
                <p className="text-sm text-slate-500">
                  Últimos registros del backend.
                </p>
              </div>
            </div>

            {loadingLogs ? (
              <p className="text-slate-500">Cargando logs...</p>
            ) : logs.length === 0 ? (
              <p className="text-slate-500">No hay logs registrados.</p>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-2xl bg-slate-50 border border-slate-200 p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <p className="font-black text-slate-900">
                        {log.accion}
                      </p>

                      <span className="text-xs text-slate-400">
                        {formatDate(log.fechaHora)}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      {log.descripcion}
                    </p>

                    <span className="inline-flex mt-3 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold">
                      {log.modulo}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminAreas;