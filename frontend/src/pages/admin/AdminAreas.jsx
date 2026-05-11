import { useState } from "react";
import { Plus } from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { useData } from "../../context/DataContext.jsx";

function AdminAreas() {
  const { areas, createArea } = useData();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.description) {
      setMessage("Completa el nombre y la descripción del área.");
      return;
    }

    createArea(form);

    setForm({
      name: "",
      description: "",
    });

    setMessage("Área creada correctamente.");
  };

  return (
    <div>
      <SectionHeader
        title="Gestión de áreas"
        description="Administra las áreas de NovaTech Solutions usadas para clasificar vacantes."
      />

      {message && (
        <div className="mb-5 bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl px-5 py-4 font-medium">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            Nueva área
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nombre del área
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Data Analytics"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe el objetivo del área..."
                className="w-full min-h-32 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
            >
              <Plus size={18} />
              Crear área
            </button>
          </div>
        </form>

        <section className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
          {areas.map((area) => (
            <article
              key={area.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-slate-900">
                {area.name}
              </h3>

              <p className="text-slate-500 mt-3">
                {area.description}
              </p>

              <span className="inline-flex mt-5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                Activa
              </span>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

export default AdminAreas;