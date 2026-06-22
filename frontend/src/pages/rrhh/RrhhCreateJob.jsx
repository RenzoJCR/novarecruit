import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  MapPin,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { areaService } from "../../services/areaService.js";
import { habilidadService } from "../../services/habilidadService.js";
import { vacanteService } from "../../services/vacanteService.js";

const initialForm = {
  titulo: "",
  descripcion: "",
  modalidad: "REMOTO",
  ubicacion: "",
  salario: "",
  nivelExperiencia: "INTERMEDIO",
  fechaCierre: "",
  areaId: "",
};

const initialSkill = {
  habilidadId: "",
  nivelRequerido: "INTERMEDIO",
  obligatorio: true,
};

function RrhhCreateJob() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [requiredSkills, setRequiredSkills] = useState([initialSkill]);

  const [areas, setAreas] = useState([]);
  const [habilidades, setHabilidades] = useState([]);

  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const selectedSkillsIds = useMemo(() => {
    return requiredSkills
      .map((item) => Number(item.habilidadId))
      .filter((id) => !Number.isNaN(id) && id > 0);
  }, [requiredSkills]);

  const loadCatalogs = async () => {
    try {
      setLoadingCatalogs(true);

      const [areasData, habilidadesData] = await Promise.all([
        areaService.getActive(),
        habilidadService.getActive(),
      ]);

      setAreas(areasData);
      setHabilidades(habilidadesData);

      setForm((prev) => ({
        ...prev,
        areaId: areasData[0]?.id || "",
      }));

      setRequiredSkills([
        {
          ...initialSkill,
          habilidadId: habilidadesData[0]?.id || "",
        },
      ]);
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudieron cargar áreas o habilidades.",
        "error"
      );
    } finally {
      setLoadingCatalogs(false);
    }
  };

  useEffect(() => {
    loadCatalogs();
  }, []);

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4500);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillChange = (index, field, value) => {
    setRequiredSkills((prevSkills) =>
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
    setRequiredSkills((prevSkills) => [
      ...prevSkills,
      {
        ...initialSkill,
        habilidadId: habilidades[0]?.id || "",
      },
    ]);
  };

  const removeSkill = (index) => {
    if (requiredSkills.length === 1) {
      showMessage("La vacante debe tener al menos una habilidad.", "error");
      return;
    }

    setRequiredSkills((prevSkills) =>
      prevSkills.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const validateForm = () => {
    if (!currentUser?.id) {
      return "No se encontró el usuario RRHH autenticado.";
    }

    if (!form.titulo.trim()) return "Ingresa el título de la vacante.";

    if (form.titulo.trim().length < 5) {
      return "El título debe tener al menos 5 caracteres.";
    }

    if (!form.descripcion.trim()) {
      return "Ingresa la descripción de la vacante.";
    }

    if (form.descripcion.trim().length < 20) {
      return "La descripción debe tener al menos 20 caracteres.";
    }

    if (!form.areaId) return "Selecciona un área.";

    if (!form.modalidad) return "Selecciona una modalidad.";

    if (!form.nivelExperiencia) {
      return "Selecciona el nivel de experiencia.";
    }

    if (!form.fechaCierre) return "Selecciona una fecha de cierre.";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const closeDate = new Date(`${form.fechaCierre}T00:00:00`);

    if (closeDate < today) {
      return "La fecha de cierre no puede ser anterior a hoy.";
    }

    if (requiredSkills.length === 0) {
      return "Agrega al menos una habilidad requerida.";
    }

    const hasEmptySkill = requiredSkills.some((item) => !item.habilidadId);

    if (hasEmptySkill) {
      return "Todas las habilidades deben estar seleccionadas.";
    }

    const uniqueSkills = new Set(selectedSkillsIds);

    if (uniqueSkills.size !== selectedSkillsIds.length) {
      return "No puedes repetir la misma habilidad.";
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
      nivelExperiencia: form.nivelExperiencia,
      fechaCierre: form.fechaCierre,
      areaId: Number(form.areaId),
      rrhhId: Number(currentUser.id),
      habilidades: requiredSkills.map((item) => ({
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

  const getAvailableSkillsForRow = (currentIndex) => {
    const currentSkillId = Number(requiredSkills[currentIndex]?.habilidadId);

    return habilidades.filter((habilidad) => {
      const habilidadId = Number(habilidad.id);

      return (
        habilidadId === currentSkillId || !selectedSkillsIds.includes(habilidadId)
      );
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
        title="Crear vacante"
        description="Registra una nueva oportunidad laboral para iniciar el proceso de selección."
      />

      {message && (
        <div
          className={`mb-5 border rounded-2xl px-4 py-3 text-sm font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <Link
        to="/rrhh/vacantes"
        className="inline-flex items-center gap-2 text-amber-700 font-black mb-5"
      >
        <ArrowLeft size={18} />
        Volver a vacantes
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-black text-slate-900">
            Datos de la vacante
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Completa la información principal que verá el postulante.
          </p>

          {loadingCatalogs ? (
            <div className="mt-5 border border-slate-200 rounded-xl p-5 text-center text-slate-500">
              Cargando datos...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Título *
                </label>

                <div className="relative">
                  <Briefcase
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none"
                  />

                  <input
                    name="titulo"
                    value={form.titulo}
                    onChange={handleFormChange}
                    placeholder="Ej: Desarrollador Backend Java"
                    className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-11 outline-none bg-white text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Área *
                </label>

                <select
                  name="areaId"
                  value={form.areaId}
                  onChange={handleFormChange}
                  className="input-light"
                >
                  {areas.length === 0 && (
                    <option value="">No hay áreas activas</option>
                  )}

                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nivel de experiencia *
                </label>

                <select
                  name="nivelExperiencia"
                  value={form.nivelExperiencia}
                  onChange={handleFormChange}
                  className="input-light"
                >
                  <option value="JUNIOR">Junior</option>
                  <option value="INTERMEDIO">Intermedio</option>
                  <option value="SENIOR">Senior</option>
                  <option value="LEAD">Lead</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Modalidad *
                </label>

                <select
                  name="modalidad"
                  value={form.modalidad}
                  onChange={handleFormChange}
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
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none"
                  />

                  <input
                    name="ubicacion"
                    value={form.ubicacion}
                    onChange={handleFormChange}
                    placeholder="Ej: Lima, Perú"
                    className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-11 outline-none bg-white text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Salario referencial
                </label>

                <input
                  type="number"
                  min="0"
                  name="salario"
                  value={form.salario}
                  onChange={handleFormChange}
                  placeholder="Ej: 3500"
                  className="input-light"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Fecha de cierre *
                </label>

                <div className="relative">
                  <Calendar
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none"
                  />

                  <input
                    type="date"
                    name="fechaCierre"
                    value={form.fechaCierre}
                    onChange={handleFormChange}
                    className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-11 outline-none bg-white text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Descripción *
                </label>

                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleFormChange}
                  placeholder="Describe el perfil, responsabilidades y condiciones principales."
                  className="w-full min-h-28 border border-slate-300 rounded-xl p-3 outline-none bg-white text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Habilidades requeridas
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Define los requisitos que RRHH usará para revisar postulantes.
              </p>
            </div>

            <button
              type="button"
              onClick={addSkill}
              disabled={habilidades.length === 0}
              className="inline-flex items-center justify-center gap-2 border border-amber-200 bg-amber-50 hover:bg-amber-100 disabled:bg-slate-100 text-amber-700 disabled:text-slate-500 px-4 py-2.5 rounded-xl text-sm font-black"
            >
              <Plus size={17} />
              Agregar habilidad
            </button>
          </div>

          {habilidades.length === 0 ? (
            <div className="border border-amber-200 bg-amber-50 text-amber-700 rounded-xl p-4 text-sm font-semibold">
              No hay habilidades activas disponibles. Primero registra
              habilidades desde el módulo correspondiente.
            </div>
          ) : (
            <div className="space-y-3">
              {requiredSkills.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-[1fr_180px_160px_auto] gap-3 items-center border border-slate-200 rounded-xl p-4"
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
                      {getAvailableSkillsForRow(index).map((habilidad) => (
                        <option key={habilidad.id} value={habilidad.id}>
                          {habilidad.nombre}
                        </option>
                      ))}
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

                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="inline-flex items-center justify-center gap-1.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-2 rounded-xl text-sm font-bold md:mt-6"
                  >
                    <Trash2 size={15} />
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col md:flex-row justify-end gap-3">
          <Link
            to="/rrhh/vacantes"
            className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl text-sm font-black"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={saving || loadingCatalogs}
            className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white px-5 py-3 rounded-xl text-sm font-black"
          >
            <Save size={17} />
            {saving ? "Guardando..." : "Crear vacante"}
          </button>
        </section>
      </form>
    </div>
  );
}

export default RrhhCreateJob;