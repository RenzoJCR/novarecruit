import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  MapPin,
  Plus,
  Save,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { areaService } from "../../services/areaService.js";
import { habilidadService } from "../../services/habilidadService.js";
import { userService } from "../../services/userService.js";
import { vacanteService } from "../../services/vacanteService.js";

const initialForm = {
  titulo: "",
  descripcion: "",
  modalidad: "REMOTO",
  ubicacion: "Lima, Perú",
  salario: "",
  nivelExperiencia: "Junior",
  fechaCierre: "",
  areaId: "",
  rrhhId: "",
};

const initialSkill = {
  habilidadId: "",
  nivelRequerido: "BASICO",
  obligatorio: true,
};

const inputWithIconClass =
  "w-full border border-slate-300 rounded-xl py-3 pr-4 pl-12 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

function RrhhCreateJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [selectedSkills, setSelectedSkills] = useState([initialSkill]);

  const [areas, setAreas] = useState([]);
  const [skills, setSkills] = useState([]);
  const [rrhhUsers, setRrhhUsers] = useState([]);

  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const usedSkillIds = useMemo(() => {
    return selectedSkills
      .map((item) => Number(item.habilidadId))
      .filter(Boolean);
  }, [selectedSkills]);

  useEffect(() => {
    loadCatalogs();
  }, []);

  const loadCatalogs = async () => {
    try {
      setLoadingCatalogs(true);

      const [areasData, skillsData, usersData] = await Promise.all([
        areaService.getActive(),
        habilidadService.getActive(),
        userService.getAll(),
      ]);

      const rrhhData = usersData.filter(
        (user) => user.estado && user.rolNombre === "RECURSOS_HUMANOS"
      );

      setAreas(areasData);
      setSkills(skillsData);
      setRrhhUsers(rrhhData);

      setForm((prevForm) => ({
        ...prevForm,
        areaId: areasData[0]?.id || "",
        rrhhId: rrhhData[0]?.id || "",
      }));

      setSelectedSkills([
        {
          ...initialSkill,
          habilidadId: skillsData[0]?.id || "",
        },
      ]);
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudieron cargar los catálogos.",
        "error"
      );
    } finally {
      setLoadingCatalogs(false);
    }
  };

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSkillChange = (index, field, value) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: field === "obligatorio" ? value === "true" : value,
            }
          : item
      )
    );
  };

  const addSkill = () => {
    setSelectedSkills((prevSkills) => [
      ...prevSkills,
      {
        ...initialSkill,
        habilidadId: "",
      },
    ]);
  };

  const removeSkill = (index) => {
    if (selectedSkills.length === 1) {
      showMessage("La vacante debe tener al menos una habilidad.", "error");
      return;
    }

    setSelectedSkills((prevSkills) =>
      prevSkills.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const validateForm = () => {
    if (!form.titulo.trim()) return "Ingresa el título de la vacante.";
    if (form.titulo.trim().length < 5)
      return "El título debe tener al menos 5 caracteres.";

    if (!form.descripcion.trim()) return "Ingresa la descripción de la vacante.";
    if (form.descripcion.trim().length < 20)
      return "La descripción debe tener al menos 20 caracteres.";

    if (!form.modalidad) return "Selecciona la modalidad.";
    if (!form.areaId) return "Selecciona el área.";
    if (!form.rrhhId) return "Selecciona el responsable RRHH.";
    if (!form.nivelExperiencia.trim())
      return "Ingresa el nivel de experiencia.";

    if (!form.fechaCierre) return "Selecciona la fecha de cierre.";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const closingDate = new Date(`${form.fechaCierre}T00:00:00`);
    if (closingDate < today) {
      return "La fecha de cierre no puede ser anterior a hoy.";
    }

    if (form.salario && Number(form.salario) <= 0) {
      return "El salario debe ser mayor a cero.";
    }

    if (selectedSkills.length === 0) {
      return "Agrega al menos una habilidad requerida.";
    }

    const cleanSkillIds = selectedSkills.map((item) => Number(item.habilidadId));

    if (cleanSkillIds.some((id) => !id)) {
      return "Todas las habilidades seleccionadas deben ser válidas.";
    }

    const uniqueIds = new Set(cleanSkillIds);

    if (uniqueIds.size !== cleanSkillIds.length) {
      return "No puedes repetir la misma habilidad en la vacante.";
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
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      modalidad: form.modalidad,
      ubicacion: form.ubicacion.trim() || null,
      salario: form.salario ? Number(form.salario) : null,
      nivelExperiencia: form.nivelExperiencia.trim(),
      fechaCierre: form.fechaCierre,
      areaId: Number(form.areaId),
      rrhhId: Number(form.rrhhId),
      habilidades: selectedSkills.map((item) => ({
        habilidadId: Number(item.habilidadId),
        nivelRequerido: item.nivelRequerido,
        obligatorio: Boolean(item.obligatorio),
      })),
    };

    try {
      setSaving(true);

      await vacanteService.create(payload);

      showMessage("Vacante creada correctamente.", "success");

      setTimeout(() => {
        navigate("/rrhh/vacantes");
      }, 900);
    } catch (error) {
      showMessage(error.userMessage || "No se pudo crear la vacante.", "error");
    } finally {
      setSaving(false);
    }
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  const getSkillName = (id) => {
    return skills.find((skill) => Number(skill.id) === Number(id))?.nombre;
  };

  return (
    <div>
      <SectionHeader
        title="Crear vacante"
        description="Registra una nueva vacante y define sus habilidades requeridas."
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
        className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6"
      >
        <section className="space-y-6">
          <div className="bg-white/95 border border-slate-200 rounded-[2rem] p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center">
                <Briefcase size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Datos principales
                </h2>
                <p className="text-sm text-slate-500">
                  Información general que verá el postulante.
                </p>
              </div>
            </div>

            {loadingCatalogs ? (
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 text-center">
                <h3 className="text-xl font-black text-slate-900">
                  Cargando catálogos...
                </h3>
                <p className="text-slate-500 mt-2">
                  Consultando áreas, habilidades y usuarios RRHH desde MySQL.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Título *
                  </label>
                  <div className="relative">
                    <Briefcase
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                    />
                    <input
                      name="titulo"
                      value={form.titulo}
                      onChange={handleChange}
                      placeholder="Ej: Frontend React Developer Jr"
                      className={inputWithIconClass}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
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
                      placeholder="Describe las funciones principales del puesto..."
                      className="w-full min-h-36 border border-slate-300 rounded-xl py-3 pr-4 pl-12 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Área *
                  </label>
                  <div className="relative">
                    <Building2
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                    />
                    <select
                      name="areaId"
                      value={form.areaId}
                      onChange={handleChange}
                      className={inputWithIconClass}
                    >
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Responsable RRHH *
                  </label>
                  <div className="relative">
                    <UserRound
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                    />
                    <select
                      name="rrhhId"
                      value={form.rrhhId}
                      onChange={handleChange}
                      className={inputWithIconClass}
                    >
                      {rrhhUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.nombreCompleto}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Modalidad *
                  </label>
                  <select
                    name="modalidad"
                    value={form.modalidad}
                    onChange={handleChange}
                    className="input-light"
                  >
                    <option value="REMOTO">Remoto</option>
                    <option value="HIBRIDO">Híbrido</option>
                    <option value="PRESENCIAL">Presencial</option>
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
                      name="ubicacion"
                      value={form.ubicacion}
                      onChange={handleChange}
                      placeholder="Ej: Lima, Perú"
                      className={inputWithIconClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Salario referencial
                  </label>
                  <div className="relative">
                    <DollarSign
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                    />
                    <input
                      type="number"
                      name="salario"
                      value={form.salario}
                      onChange={handleChange}
                      placeholder="Ej: 3000"
                      className={inputWithIconClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Nivel de experiencia *
                  </label>
                  <select
                    name="nivelExperiencia"
                    value={form.nivelExperiencia}
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
                      name="fechaCierre"
                      value={form.fechaCierre}
                      onChange={handleChange}
                      className={inputWithIconClass}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/95 border border-slate-200 rounded-[2rem] p-7 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Habilidades requeridas
                </h2>
                <p className="text-sm text-slate-500">
                  Define lo mínimo que debe cumplir el postulante.
                </p>
              </div>

              <button
                type="button"
                onClick={addSkill}
                className="inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-2xl font-black"
              >
                <Plus size={17} />
                Agregar habilidad
              </button>
            </div>

            <div className="space-y-4">
              {selectedSkills.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[1fr_180px_150px_auto] gap-4 rounded-3xl bg-slate-50 border border-slate-200 p-4"
                >
                  <div>
                    <label className="block text-xs font-black text-slate-500 mb-2">
                      Habilidad
                    </label>
                    <select
                      value={item.habilidadId}
                      onChange={(e) =>
                        handleSkillChange(index, "habilidadId", e.target.value)
                      }
                      className="input-light"
                    >
                      <option value="">Seleccionar</option>
                      {skills.map((skill) => {
                        const selectedByOther =
                          usedSkillIds.includes(Number(skill.id)) &&
                          Number(item.habilidadId) !== Number(skill.id);

                        return (
                          <option
                            key={skill.id}
                            value={skill.id}
                            disabled={selectedByOther}
                          >
                            {skill.nombre} · {skill.categoria}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-500 mb-2">
                      Nivel
                    </label>
                    <select
                      value={item.nivelRequerido}
                      onChange={(e) =>
                        handleSkillChange(
                          index,
                          "nivelRequerido",
                          e.target.value
                        )
                      }
                      className="input-light"
                    >
                      <option value="BASICO">Básico</option>
                      <option value="INTERMEDIO">Intermedio</option>
                      <option value="AVANZADO">Avanzado</option>
                      <option value="EXPERTO">Experto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-500 mb-2">
                      Tipo
                    </label>
                    <select
                      value={String(item.obligatorio)}
                      onChange={(e) =>
                        handleSkillChange(index, "obligatorio", e.target.value)
                      }
                      className="input-light"
                    >
                      <option value="true">Obligatoria</option>
                      <option value="false">Deseable</option>
                    </select>
                  </div>

                  <div className="flex md:items-end">
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 px-4 py-3 rounded-2xl font-black"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-white/95 border border-slate-200 rounded-[2rem] p-7 shadow-sm h-fit">
            <h2 className="text-2xl font-black text-slate-900">
              Resumen de vacante
            </h2>

            <p className="text-slate-500 text-sm mt-2">
              Revisa los datos antes de registrar la vacante.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-black text-slate-500">Título</p>
                <p className="font-black text-slate-900 mt-1">
                  {form.titulo || "Sin título"}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-black text-slate-500">Área</p>
                <p className="font-black text-slate-900 mt-1">
                  {areas.find((area) => Number(area.id) === Number(form.areaId))
                    ?.nombre || "Sin área"}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-xs font-black text-slate-500">
                  Habilidades
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedSkills.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold"
                    >
                      {getSkillName(item.habilidadId) || "Pendiente"}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-sky-50 border border-emerald-100 p-5">
              <div className="flex items-start gap-3">
                <Sparkles size={22} className="text-emerald-600 shrink-0 mt-1" />
                <p className="text-sm text-slate-600">
                  Esta vacante se guardará en MySQL y generará un log de sistema
                  para auditoría del administrador.
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <button
                type="submit"
                disabled={saving || loadingCatalogs}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 disabled:from-slate-300 disabled:to-slate-300 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20 disabled:shadow-none"
              >
                <Save size={18} />
                {saving ? "Guardando..." : "Crear vacante"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/rrhh/vacantes")}
                className="w-full inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-black"
              >
                <X size={18} />
                Cancelar
              </button>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

export default RrhhCreateJob;