import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Edit,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { areaService } from "../../services/areaService.js";

const initialForm = {
  nombre: "",
  descripcion: "",
};

function AdminAreas() {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deactivatingId, setDeactivatingId] = useState(null);
  const [reactivatingId, setReactivatingId] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const loadAreas = async () => {
    try {
      setLoading(true);
      const data = await areaService.getAll();
      setAreas(data);
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudieron cargar las áreas.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAreas();
  }, []);

  const filteredAreas = useMemo(() => {
    const value = search.toLowerCase().trim();

    return areas.filter((area) => {
      const statusText = area.estado ? "activa" : "inactiva";

      const matchesSearch =
        area.nombre?.toLowerCase().includes(value) ||
        area.descripcion?.toLowerCase().includes(value) ||
        statusText.includes(value);

      const matchesStatus =
        selectedStatus === "Todos" ||
        (selectedStatus === "Activas" && area.estado === true) ||
        (selectedStatus === "Inactivas" && area.estado === false);

      return matchesSearch && matchesStatus;
    });
  }, [areas, search, selectedStatus]);

  const totalActivas = areas.filter((item) => item.estado === true).length;
  const totalInactivas = areas.filter((item) => item.estado === false).length;

  const resetForm = () => {
    setForm(initialForm);
    setSelectedArea(null);
  };

  const openCreate = () => {
    setSelectedArea(null);
    setForm(initialForm);
  };

  const openEdit = (area) => {
    setSelectedArea(area);
    setForm({
      nombre: area.nombre || "",
      descripcion: area.descripcion || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.nombre.trim()) return "Ingresa el nombre del área.";

    if (form.nombre.trim().length < 3) {
      return "El nombre debe tener al menos 3 caracteres.";
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
      descripcion: form.descripcion.trim() || null,
    };

    try {
      setSaving(true);

      if (selectedArea) {
        await areaService.update(selectedArea.id, payload);
        showMessage("Área actualizada correctamente.", "success");
      } else {
        await areaService.create(payload);
        showMessage("Área creada correctamente.", "success");
      }

      resetForm();
      await loadAreas();
    } catch (error) {
      showMessage(error.userMessage || "No se pudo guardar el área.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (area) => {
    const confirmed = window.confirm(
      `¿Deseas desactivar el área "${area.nombre}"?`
    );

    if (!confirmed) return;

    try {
      setDeactivatingId(area.id);

      await areaService.deactivate(area.id);

      showMessage("Área desactivada correctamente.", "success");
      await loadAreas();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo desactivar el área.",
        "error"
      );
    } finally {
      setDeactivatingId(null);
    }
  };

  const handleReactivate = async (area) => {
    const confirmed = window.confirm(
      `¿Deseas reactivar el área "${area.nombre}"?`
    );

    if (!confirmed) return;

    try {
      setReactivatingId(area.id);

      await areaService.reactivate(area.id);

      showMessage("Área reactivada correctamente.", "success");
      await loadAreas();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo reactivar el área.",
        "error"
      );
    } finally {
      setReactivatingId(null);
    }
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div>
      <SectionHeader
        title="Áreas"
        description="Administra las áreas internas asociadas a las vacantes."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-black"
          >
            <Plus size={17} />
            Nueva área
          </button>
        }
      />

      {message && (
        <div
          className={`mb-5 border rounded-2xl px-4 py-3 text-sm font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Total áreas</p>
          <p className="text-3xl font-black text-rose-600 mt-1">
            {areas.length}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Activas</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">
            {totalActivas}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Inactivas</p>
          <p className="text-3xl font-black text-slate-700 mt-1">
            {totalInactivas}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <main>
          <section className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-3">
            <div className="flex items-center gap-3 border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100">
              <Search size={18} className="text-rose-600" />
              <input
                type="text"
                placeholder="Buscar por nombre, descripción o estado..."
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
              <option value="Todos">Todas</option>
              <option value="Activas">Activas</option>
              <option value="Inactivas">Inactivas</option>
            </select>

            <button
              type="button"
              onClick={loadAreas}
              className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-black"
            >
              <RefreshCw size={17} />
              Actualizar
            </button>
          </section>

          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <h2 className="text-xl font-black text-slate-900">
                Cargando áreas...
              </h2>
            </div>
          ) : filteredAreas.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <Building2 size={36} className="mx-auto text-rose-600" />
              <h2 className="text-xl font-black text-slate-900 mt-3">
                No hay áreas para mostrar
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Crea una nueva área o ajusta los filtros.
              </p>
            </div>
          ) : (
            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="hidden lg:grid grid-cols-[1.2fr_1.4fr_0.7fr_220px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase">
                <span>Área</span>
                <span>Descripción</span>
                <span>Estado</span>
                <span className="text-right">Acciones</span>
              </div>

              <div className="divide-y divide-slate-200">
                {filteredAreas.map((area) => (
                  <div
                    key={area.id}
                    className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.4fr_0.7fr_220px] gap-4 px-5 py-4 items-center"
                  >
                    <div>
                      <p className="font-black text-slate-900">
                        {area.nombre}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-600">
                        {area.descripcion || "Sin descripción"}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${
                          area.estado
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {area.estado ? "Activa" : "Inactiva"}
                      </span>
                    </div>

                    <div className="flex flex-wrap justify-start lg:justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(area)}
                        className="inline-flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-sm font-bold"
                      >
                        <Edit size={16} />
                        Editar
                      </button>

                      {area.estado && (
                        <button
                          type="button"
                          disabled={deactivatingId === area.id}
                          onClick={() => handleDeactivate(area)}
                          className="inline-flex items-center gap-1.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 disabled:bg-slate-100 text-rose-700 disabled:text-slate-500 px-3 py-2 rounded-xl text-sm font-bold"
                        >
                          <Trash2 size={16} />
                          Desactivar
                        </button>
                      )}

                      {!area.estado && (
                        <button
                          type="button"
                          disabled={reactivatingId === area.id}
                          onClick={() => handleReactivate(area)}
                          className="inline-flex items-center gap-1.5 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 disabled:bg-slate-100 text-emerald-700 disabled:text-slate-500 px-3 py-2 rounded-xl text-sm font-bold"
                        >
                          <RotateCcw size={16} />
                          Reactivar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        <aside>
          <section className="bg-white border border-slate-200 rounded-2xl p-5 sticky top-24">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {selectedArea ? "Editar área" : "Nueva área"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedArea
                    ? "Actualiza la información del área."
                    : "Registra un área para clasificar vacantes."}
                </p>
              </div>

              {selectedArea && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-9 h-9 rounded-xl border border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nombre *
                </label>

                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Desarrollo de Software"
                  className="input-light"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Descripción
                </label>

                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción breve del área."
                  className="w-full min-h-28 border border-slate-300 rounded-xl p-3 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl text-sm font-black"
              >
                <Save size={17} />
                {saving
                  ? "Guardando..."
                  : selectedArea
                    ? "Guardar cambios"
                    : "Crear área"}
              </button>
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default AdminAreas;