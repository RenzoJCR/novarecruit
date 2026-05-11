import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

function RrhhCreateJob() {
  const navigate = useNavigate();
  const { createJob } = useData();

  const [form, setForm] = useState(initialForm);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [message, setMessage] = useState("");

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
      return;
    }

    if (selectedSkills.length === 0) {
      setMessage("Selecciona al menos una habilidad requerida.");
      return;
    }

    createJob({
      ...form,
      skills: selectedSkills,
    });

    setMessage("Vacante creada correctamente.");

    setTimeout(() => {
      navigate("/rrhh/vacantes");
    }, 800);
  };

  return (
    <div>
      <SectionHeader
        title="Crear vacante"
        description="Registra una nueva vacante y define las habilidades requeridas para los postulantes."
      />

      {message && (
        <div className="mb-5 bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl px-5 py-4 font-medium">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6"
      >
        <section className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-5">
            Datos de la vacante
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Título de la vacante
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ej: Frontend React Developer Jr"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Área
              </label>
              <select
                name="area"
                value={form.area}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              >
                {areas.map((area) => (
                  <option key={area.id} value={area.name}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Modalidad
              </label>
              <select
                name="modality"
                value={form.modality}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Presencial">Presencial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Ubicación
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Lima, Perú"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rango salarial
              </label>
              <input
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="Ej: S/ 3,000 - S/ 4,000"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Experiencia
              </label>
              <select
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="Junior">Junior</option>
                <option value="Semi Senior">Semi Senior</option>
                <option value="Senior">Senior</option>
                <option value="Practicante">Practicante</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Fecha de cierre
              </label>
              <input
                type="date"
                name="closingDate"
                value={form.closingDate}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe las responsabilidades y requisitos generales del puesto..."
                className="w-full min-h-36 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Habilidades requeridas
          </h2>

          <p className="text-sm text-slate-500 mb-5">
            Selecciona las habilidades que el postulante deberá declarar al postular.
          </p>

          <div className="space-y-4">
            {skills.map((skill) => {
              const selectedSkill = selectedSkills.find(
                (item) => item.name === skill.name
              );

              return (
                <div
                  key={skill.id}
                  className="border border-slate-200 rounded-2xl p-4"
                >
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedSkill)}
                      onChange={() => toggleSkill(skill.name)}
                    />
                    <span className="font-semibold text-slate-900">
                      {skill.name}
                    </span>
                  </label>

                  {selectedSkill && (
                    <select
                      value={selectedSkill.level}
                      onChange={(e) =>
                        updateSkillLevel(skill.name, e.target.value)
                      }
                      className="mt-3 w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
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
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
          >
            Publicar vacante
          </button>
        </section>
      </form>
    </div>
  );
}

export default RrhhCreateJob;