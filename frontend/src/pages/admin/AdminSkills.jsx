import { useEffect, useMemo, useState } from "react";
import {
  BrainCircuit,
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
import { habilidadService } from "../../services/habilidadService.js";

const initialForm = {
  nombre: "",
  categoria: "",
};

const categoriasSugeridas = [
  "Frontend",
  "Backend",
  "Base de datos",
  "DevOps",
  "Cloud",
  "Testing",
  "Metodologías",
  "Diseño",
  "Comunicación",
  "Gestión",
];

function AdminSkills() {
  const [habilidades, setHabilidades] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

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

  const loadHabilidades = async () => {
    try {
      setLoading(true);

      const data = await habilidadService.getAll();
      setHabilidades(data);
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudieron cargar las habilidades.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabilidades();
  }, []);

  const categoriasDisponibles = useMemo(() => {
    const categorias = habilidades
      .map((item) => item.categoria)
      .filter(Boolean);

    return [...new Set(categorias)].sort();
  }, [habilidades]);

  const filteredHabilidades = useMemo(() => {
    const value = search.toLowerCase().trim();

    return habilidades.filter((habilidad) => {
      const estadoTexto = habilidad.estado ? "activa" : "inactiva";

      const matchesSearch =
        habilidad.nombre?.toLowerCase().includes(value) ||
        habilidad.categoria?.toLowerCase().includes(value) ||
        estadoTexto.includes(value);

      const matchesStatus =
        selectedStatus === "Todos" ||
        (selectedStatus === "Activas" && habilidad.estado === true) ||
        (selectedStatus === "Inactivas" && habilidad.estado === false);

      const matchesCategory =
        selectedCategory === "Todas" ||
        habilidad.categoria === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [habilidades, search, selectedStatus, selectedCategory]);

  const totalActivas = habilidades.filter((item) => item.estado === true).length;

  const totalInactivas = habilidades.filter(
    (item) => item.estado === false
  ).length;

  const resetForm = () => {
    setForm(initialForm);
    setSelectedSkill(null);
  };

  const openCreate = () => {
    setSelectedSkill(null);
    setForm(initialForm);
  };

  const openEdit = (habilidad) => {
    setSelectedSkill(habilidad);
    setForm({
      nombre: habilidad.nombre || "",
      categoria: habilidad.categoria || "",
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
    const nombre = form.nombre.trim();
    const categoria = form.categoria.trim();

    if (!nombre) return "Ingresa el nombre de la habilidad.";

    if (nombre.length < 2) {
      return "El nombre debe tener al menos 2 caracteres.";
    }

    if (!categoria) return "Ingresa la categoría de la habilidad.";

    if (categoria.length < 2) {
      return "La categoría debe tener al menos 2 caracteres.";
    }

    const validTextRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9#+.\-/ ]+$/;

    if (!validTextRegex.test(nombre)) {
      return "El nombre contiene caracteres no permitidos.";
    }

    if (!validTextRegex.test(categoria)) {
      return "La categoría contiene caracteres no permitidos.";
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
      categoria: form.categoria.trim(),
    };

    try {
      setSaving(true);

      if (selectedSkill) {
        await habilidadService.update(selectedSkill.id, payload);
        showMessage("Habilidad actualizada correctamente.", "success");
      } else {
        await habilidadService.create(payload);
        showMessage("Habilidad creada correctamente.", "success");
      }

      resetForm();
      await loadHabilidades();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo guardar la habilidad.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (habilidad) => {
    const confirmed = window.confirm(
      `¿Deseas desactivar la habilidad "${habilidad.nombre}"?`
    );

    if (!confirmed) return;

    try {
      setDeactivatingId(habilidad.id);

      await habilidadService.deactivate(habilidad.id);

      showMessage("Habilidad desactivada correctamente.", "success");
      await loadHabilidades();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo desactivar la habilidad.",
        "error"
      );
    } finally {
      setDeactivatingId(null);
    }
  };

  const handleReactivate = async (habilidad) => {
    const confirmed = window.confirm(
      `¿Deseas reactivar la habilidad "${habilidad.nombre}"?`
    );

    if (!confirmed) return;

    try {
      setReactivatingId(habilidad.id);

      await habilidadService.reactivate(habilidad.id);

      showMessage("Habilidad reactivada correctamente.", "success");
      await loadHabilidades();
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo reactivar la habilidad.",
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
        title="Habilidades"
        description="Administra el catálogo de habilidades usadas en vacantes, postulaciones y evaluaciones."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-black"
          >
            <Plus size={17} />
            Nueva habilidad
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
          <p className="text-sm text-slate-500 font-semibold">
            Total habilidades
          </p>
          <p className="text-3xl font-black text-rose-600 mt-1">
            {habilidades.length}
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
          <section className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-[1fr_190px_190px_auto] gap-3">
            <div className="flex items-center gap-3 border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100">
              <Search size={18} className="text-rose-600" />

              <input
                type="text"
                placeholder="Buscar por nombre, categoría o estado..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none bg-transparent text-sm text-slate-900"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-light"
            >
              <option value="Todas">Todas las categorías</option>

              {categoriasDisponibles.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-light"
            >
              <option value="Todos">Todos</option>
              <option value="Activas">Activas</option>
              <option value="Inactivas">Inactivas</option>
            </select>

            <button
              type="button"
              onClick={loadHabilidades}
              className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-black"
            >
              <RefreshCw size={17} />
              Actualizar
            </button>
          </section>

          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <h2 className="text-xl font-black text-slate-900">
                Cargando habilidades...
              </h2>
            </div>
          ) : filteredHabilidades.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
              <BrainCircuit size={36} className="mx-auto text-rose-600" />

              <h2 className="text-xl font-black text-slate-900 mt-3">
                No hay habilidades para mostrar
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Crea una habilidad o ajusta los filtros.
              </p>
            </div>
          ) : (
            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="hidden lg:grid grid-cols-[1.2fr_1fr_0.7fr_230px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase">
                <span>Habilidad</span>
                <span>Categoría</span>
                <span>Estado</span>
                <span className="text-right">Acciones</span>
              </div>

              <div className="divide-y divide-slate-200">
                {filteredHabilidades.map((habilidad) => (
                  <div
                    key={habilidad.id}
                    className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_0.7fr_230px] gap-4 px-5 py-4 items-center"
                  >
                    <div>
                      <p className="font-black text-slate-900">
                        {habilidad.nombre}
                      </p>
                      <p className="text-xs text-slate-400">
                        ID: {habilidad.id}
                      </p>
                    </div>

                    <div>
                      <span className="inline-flex px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-black text-slate-600">
                        {habilidad.categoria}
                      </span>
                    </div>

                    <div>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${
                          habilidad.estado
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {habilidad.estado ? "Activa" : "Inactiva"}
                      </span>
                    </div>

                    <div className="flex flex-wrap justify-start lg:justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(habilidad)}
                        className="inline-flex items-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-sm font-bold"
                      >
                        <Edit size={16} />
                        Editar
                      </button>

                      {habilidad.estado && (
                        <button
                          type="button"
                          disabled={deactivatingId === habilidad.id}
                          onClick={() => handleDeactivate(habilidad)}
                          className="inline-flex items-center gap-1.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 disabled:bg-slate-100 text-rose-700 disabled:text-slate-500 px-3 py-2 rounded-xl text-sm font-bold"
                        >
                          <Trash2 size={16} />
                          Desactivar
                        </button>
                      )}

                      {!habilidad.estado && (
                        <button
                          type="button"
                          disabled={reactivatingId === habilidad.id}
                          onClick={() => handleReactivate(habilidad)}
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
                  {selectedSkill ? "Editar habilidad" : "Nueva habilidad"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {selectedSkill
                    ? "Actualiza el catálogo de habilidades."
                    : "Registra una habilidad reutilizable."}
                </p>
              </div>

              {selectedSkill && (
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
                  placeholder="Ej: React, Java, MySQL"
                  className="input-light"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Categoría *
                </label>

                <input
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  placeholder="Ej: Frontend, Backend, Base de datos"
                  list="categorias-sugeridas"
                  className="input-light"
                />

                <datalist id="categorias-sugeridas">
                  {categoriasSugeridas.map((categoria) => (
                    <option key={categoria} value={categoria} />
                  ))}
                </datalist>

                <p className="text-xs text-slate-500 mt-2">
                  Puedes escribir una categoría nueva o usar una sugerida.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl text-sm font-black"
              >
                <Save size={17} />
                {saving
                  ? "Guardando..."
                  : selectedSkill
                    ? "Guardar cambios"
                    : "Crear habilidad"}
              </button>
            </form>

            <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="font-black text-slate-900 text-sm">
                ¿Para qué sirve?
              </p>

              <p className="text-sm text-slate-600 mt-1">
                Las habilidades se usan para definir requisitos de vacantes y
                para que los postulantes declaren su experiencia.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default AdminSkills;