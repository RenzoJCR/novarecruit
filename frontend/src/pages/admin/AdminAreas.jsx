import { useState } from "react";
import {
  Building2,
  FileText,
  Plus,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { useData } from "../../context/DataContext.jsx";

const initialForm = {
  name: "",
  description: "",
};

const inputWithIconClass =
  "w-full border border-slate-300 rounded-xl py-3 pr-4 pl-12 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

function AdminAreas() {
  const { areas, createArea } = useData();

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

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
      setMessageType("error");
      return;
    }

    createArea({
      name: form.name,
      description: form.description,
    });

    setForm(initialForm);
    setMessage("Área creada correctamente.");
    setMessageType("success");
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
                Nueva área
              </h2>
              <p className="text-sm text-slate-500">
                Define una categoría para las vacantes.
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
                  name="name"
                  value={form.name}
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
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe el objetivo del área..."
                  className="w-full min-h-36 border border-slate-300 rounded-xl py-3 pr-4 pl-12 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-sky-50 border border-emerald-100 p-5">
              <div className="flex items-start gap-3">
                <Sparkles
                  size={22}
                  className="text-emerald-600 shrink-0 mt-1"
                />

                <div>
                  <h3 className="font-black text-slate-900">
                    Uso del área
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Las áreas se utilizarán para organizar vacantes,
                    postulantes, evaluaciones técnicas y reportes.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20"
            >
              <Plus size={18} />
              Crear área
            </button>
          </div>
        </form>

        <section className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-7 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Áreas registradas
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {areas.length} área(s) disponibles en el sistema.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-sm font-bold">
              <CheckCircle2 size={17} />
              Activas
            </span>
          </div>

          {areas.length === 0 ? (
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 text-center">
              <h3 className="text-xl font-black text-slate-900">
                No hay áreas registradas
              </h3>
              <p className="text-slate-500 mt-2">
                Crea la primera área para organizar las vacantes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {areas.map((area) => (
                <article
                  key={area.id}
                  className="group relative overflow-hidden bg-slate-50 border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-emerald-100 to-sky-100 rounded-full blur-2xl opacity-60 translate-x-8 -translate-y-8 group-hover:opacity-90 transition-opacity" />

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-emerald-700 flex items-center justify-center mb-5">
                      <Building2 size={23} />
                    </div>

                    <h3 className="text-xl font-black text-slate-900">
                      {area.name}
                    </h3>

                    <p className="text-slate-500 mt-3 leading-relaxed">
                      {area.description}
                    </p>

                    <span className="inline-flex items-center gap-2 mt-5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Activa
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminAreas;