import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  MapPin,
  Coins,
  Layers3,
  Sparkles,
  CheckCircle2,
  Send,
} from "lucide-react";

import { areas } from "../../data/areas.js";
import { skills } from "../../data/skills.js";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { useData } from "../../context/DataContext.jsx";

const initialForm = {
  title: "",
  area: "Frontend",
  modality: "Remoto",
  location: "Lima, Perú",
  salary: "",
  experience: "Junior",
  closingDate: "",
  description: "",
};

const inputWithIconClass =
  "w-full border border-slate-300 rounded-xl py-3 pr-4 pl-12 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

function RrhhCreateJob() {
  const navigate = useNavigate();
  const { createJob } = useData();

  const [form, setForm] = useState(initialForm);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const toggleSkill = (skillName) => {
    setSelectedSkills((prevSkills) => {
      const exists = prevSkills.some((skill) => skill.name === skillName);

      if (exists) {
        return prevSkills.filter((skill) => skill.name !== skillName);
      }

      return [
        ...prevSkills,
        {
          name: skillName,
          level: "Intermedio",
        },
      ];
    });
  };

  const updateSkillLevel = (skillName, level) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill.name === skillName
          ? {
              ...skill,
              level,
            }
          : skill
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.salary || !form.closingDate) {
      setMessage("Completa los campos obligatorios antes de crear la vacante.");
      setMessageType("error");
      return;
    }

    if (selectedSkills.length === 0) {
      setMessage("Selecciona al menos una habilidad requerida.");
      setMessageType("error");
      return;
    }

    createJob({
      ...form,
      skills: selectedSkills,
    });

    setMessage("Vacante creada correctamente. Redirigiendo al listado...");
    setMessageType("success");

    setTimeout(() => {
      navigate("/rrhh/vacantes");
    }, 900);
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div>
      <SectionHeader
        title="Crear vacante"
        description="Registra una nueva oportunidad laboral y define las habilidades que deberá declarar el postulante."
      />

      {message && (
        <div
          className={`mb-5 border rounded-3xl px-5 py-4 font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-[1fr_390px] gap-6"
      >
        <section className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-7 shadow-sm">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center">
              <Briefcase size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Datos de la vacante
              </h2>
              <p className="text-sm text-slate-500">
                Información principal que verá el postulante.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Título de la vacante *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej: Frontend React Developer Jr"
                className="input-light"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Área
              </label>
              <div className="relative">
                <Layers3
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                />
                <select
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  className={inputWithIconClass}
                >
                  {areas.map((area) => (
                    <option key={area.id} value={area.name}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Modalidad
              </label>
              <select
                name="modality"
                value={form.modality}
                onChange={handleChange}
                className="input-light"
              >
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Presencial">Presencial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Ubicación
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                />
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Lima, Perú"
                  className={inputWithIconClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Rango salarial *
              </label>
              <div className="relative">
                <Coins
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                />
                <input
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="Ej: S/ 3,000 - S/ 4,000"
                  className={inputWithIconClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Experiencia
              </label>
              <select
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="input-light"
              >
                <option value="Practicante">Practicante</option>
                <option value="Junior">Junior</option>
                <option value="Semi Senior">Semi Senior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Fecha de cierre *
              </label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                />
                <input
                  type="date"
                  name="closingDate"
                  value={form.closingDate}
                  onChange={handleChange}
                  className={inputWithIconClass}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe las responsabilidades, objetivos y requisitos generales del puesto..."
                className="input-light min-h-40"
              />
            </div>
          </div>

          <div className="mt-7 rounded-3xl bg-gradient-to-br from-emerald-50 to-sky-50 border border-emerald-100 p-5">
            <div className="flex items-start gap-3">
              <Sparkles size={22} className="text-emerald-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-black text-slate-900">
                  Vista para postulantes
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Esta información aparecerá en el listado de vacantes y en el
                  detalle de la oportunidad. Las habilidades seleccionadas se
                  solicitarán al momento de postular.
                </p>
              </div>
            </div>
          </div>
        </section>

        <aside className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-7 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                Habilidades
              </h2>
              <p className="text-sm text-slate-500">
                {selectedSkills.length} seleccionada(s)
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-500 mb-5">
            Marca las habilidades requeridas y define el nivel esperado.
          </p>

          <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
            {skills.map((skill) => {
              const selectedSkill = selectedSkills.find(
                (item) => item.name === skill.name
              );

              return (
                <div
                  key={skill.id}
                  className={`border rounded-3xl p-4 transition-all ${
                    selectedSkill
                      ? "border-emerald-200 bg-emerald-50/60"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedSkill)}
                      onChange={() => toggleSkill(skill.name)}
                      className="accent-emerald-500"
                    />
                    <div>
                      <span className="font-black text-slate-900">
                        {skill.name}
                      </span>
                      <p className="text-xs text-slate-500">
                        {skill.category}
                      </p>
                    </div>
                  </label>

                  {selectedSkill && (
                    <select
                      value={selectedSkill.level}
                      onChange={(e) =>
                        updateSkillLevel(skill.name, e.target.value)
                      }
                      className="mt-3 w-full border border-slate-300 rounded-xl px-4 py-2 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    >
                      <option value="Básico">Básico</option>
                      <option value="Intermedio">Intermedio</option>
                      <option value="Avanzado">Avanzado</option>
                      <option value="Experto">Experto</option>
                    </select>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20"
          >
            <Send size={18} />
            Publicar vacante
          </button>
        </aside>
      </form>
    </div>
  );
}

export default RrhhCreateJob;