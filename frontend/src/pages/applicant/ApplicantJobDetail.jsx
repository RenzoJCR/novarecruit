import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  DollarSign,
  MapPin,
  Send,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { vacanteService } from "../../services/vacanteService.js";
import { postulacionService } from "../../services/postulacionService.js";
import { useAuth } from "../../context/AuthContext.jsx";

function formatDate(value) {
  if (!value) return "Sin fecha";

  return new Date(`${value}T00:00:00`).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function formatMoney(value) {
  if (value === null || value === undefined) return "No especificado";

  return Number(value).toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
  });
}

function modalidadClass(modalidad) {
  const styles = {
    REMOTO: "bg-sky-50 text-sky-700 border-sky-200",
    HIBRIDO: "bg-amber-50 text-amber-700 border-amber-200",
    PRESENCIAL: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return styles[modalidad] || "bg-slate-50 text-slate-600 border-slate-200";
}

function ApplicantJobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [vacante, setVacante] = useState(null);
  const [declaredSkills, setDeclaredSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const requiredSkills = useMemo(() => vacante?.habilidades || [], [vacante]);

  const loadVacante = async () => {
    try {
      setLoading(true);

      const data = await vacanteService.getById(id);
      setVacante(data);

      setDeclaredSkills(
        (data.habilidades || []).map((item) => ({
          habilidadId: item.habilidadId,
          nivelPostulante: item.nivelRequerido || "BASICO",
          aniosExperiencia: 0,
        }))
      );
    } catch (error) {
      showMessage(error.userMessage || "No se pudo cargar la vacante.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVacante();
  }, [id]);

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4500);
  };

  const handleSkillChange = (index, field, value) => {
    setDeclaredSkills((prevSkills) =>
      prevSkills.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: field === "aniosExperiencia" ? Number(value) : value,
            }
          : item
      )
    );
  };

  const validateApplication = () => {
    if (!currentUser?.id) {
      return "No se encontró tu sesión. Inicia sesión nuevamente.";
    }

    if (!vacante) return "No se encontró la vacante.";

    if (vacante.estado !== "ACTIVA" && vacante.estado !== "EN_PROCESO") {
      return "Esta vacante ya no está disponible para postular.";
    }

    if (declaredSkills.length === 0) {
      return "Debes declarar al menos una habilidad.";
    }

    const hasInvalidSkill = declaredSkills.some(
      (item) => !item.habilidadId || !item.nivelPostulante
    );

    if (hasInvalidSkill) {
      return "Completa correctamente tus habilidades.";
    }

    const hasNegativeYears = declaredSkills.some(
      (item) => Number(item.aniosExperiencia) < 0
    );

    if (hasNegativeYears) {
      return "Los años de experiencia no pueden ser negativos.";
    }

    return null;
  };

  const handleApply = async () => {
    const validationError = validateApplication();

    if (validationError) {
      showMessage(validationError, "error");
      return;
    }

    const payload = {
      usuarioId: Number(currentUser.id),
      vacanteId: Number(id),
      habilidades: declaredSkills.map((item) => ({
        habilidadId: Number(item.habilidadId),
        nivelPostulante: item.nivelPostulante,
        aniosExperiencia: Number(item.aniosExperiencia || 0),
      })),
    };

    try {
      setSending(true);

      await postulacionService.create(payload);

      showMessage("Postulación enviada correctamente.", "success");

      setTimeout(() => {
        navigate("/applicant/postulaciones");
      }, 900);
    } catch (error) {
      showMessage(
        error.userMessage || "No se pudo enviar la postulación.",
        "error"
      );
    } finally {
      setSending(false);
    }
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  if (loading) {
    return (
      <div>
        <SectionHeader
          title="Detalle de vacante"
          description="Cargando información de la vacante."
        />

        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-black text-slate-900">
            Cargando vacante...
          </h2>
          <p className="text-slate-500 mt-1">Un momento por favor.</p>
        </div>
      </div>
    );
  }

  if (!vacante) {
    return (
      <div>
        <SectionHeader
          title="Vacante no encontrada"
          description="No se pudo encontrar la información solicitada."
        />

        <Link
          to="/applicant/vacantes"
          className="inline-flex items-center gap-2 text-sky-700 font-black"
        >
          <ArrowLeft size={18} />
          Volver a vacantes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Detalle de vacante"
        description="Revisa la información del puesto y completa tu postulación."
      />

      {message && (
        <div
          className={`mb-5 border rounded-2xl px-4 py-3 text-sm font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <Link
        to="/applicant/vacantes"
        className="inline-flex items-center gap-2 text-sky-700 font-black mb-5"
      >
        <ArrowLeft size={18} />
        Volver a vacantes
      </Link>

      <section className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <span className="inline-flex px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-black mb-3">
              {vacante.areaNombre}
            </span>

            <h1 className="text-3xl font-black text-slate-900">
              {vacante.titulo}
            </h1>

            <p className="text-sm text-slate-500 mt-2 max-w-3xl">
              {vacante.descripcion}
            </p>
          </div>

          <span
            className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${modalidadClass(
              vacante.modalidad
            )}`}
          >
            {vacante.modalidad}
          </span>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <MapPin size={18} className="text-sky-600" />
          <p className="text-sm font-black text-slate-900 mt-2">
            {vacante.ubicacion || "Sin ubicación"}
          </p>
          <p className="text-xs text-slate-500">Ubicación</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <DollarSign size={18} className="text-sky-600" />
          <p className="text-sm font-black text-slate-900 mt-2">
            {formatMoney(vacante.salario)}
          </p>
          <p className="text-xs text-slate-500">Salario</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <Briefcase size={18} className="text-sky-600" />
          <p className="text-sm font-black text-slate-900 mt-2">
            {vacante.nivelExperiencia}
          </p>
          <p className="text-xs text-slate-500">Experiencia</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <Calendar size={18} className="text-sky-600" />
          <p className="text-sm font-black text-slate-900 mt-2">
            {formatDate(vacante.fechaCierre)}
          </p>
          <p className="text-xs text-slate-500">Cierre</p>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
        <h2 className="text-xl font-black text-slate-900">
          Requisitos de la vacante
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Indica tu nivel y experiencia en cada habilidad solicitada.
        </p>

        {requiredSkills.length === 0 ? (
          <div className="mt-5 border border-slate-200 rounded-xl p-4 text-slate-500">
            Esta vacante no tiene habilidades registradas.
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {requiredSkills.map((skill, index) => (
              <div
                key={skill.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_180px_160px] gap-3 items-center border border-slate-200 rounded-xl p-4"
              >
                <div>
                  <p className="font-black text-slate-900">
                    {skill.habilidadNombre}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Nivel requerido: {skill.nivelRequerido} ·{" "}
                    {skill.obligatorio ? "Obligatoria" : "Deseable"}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 mb-2">
                    Tu nivel
                  </label>

                  <select
                    value={declaredSkills[index]?.nivelPostulante || "BASICO"}
                    onChange={(e) =>
                      handleSkillChange(
                        index,
                        "nivelPostulante",
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
                    Años de experiencia
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={declaredSkills[index]?.aniosExperiencia || 0}
                    onChange={(e) =>
                      handleSkillChange(
                        index,
                        "aniosExperiencia",
                        e.target.value
                      )
                    }
                    className="input-light"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Enviar postulación
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Tu postulación quedará asociada a tu cuenta.
            </p>
          </div>

          <button
            type="button"
            onClick={handleApply}
            disabled={sending}
            className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white px-5 py-3 rounded-xl text-sm font-black"
          >
            <Send size={17} />
            {sending ? "Enviando..." : "Postular ahora"}
          </button>
        </div>

        <div className="mt-4 border border-sky-100 bg-sky-50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={18} className="text-sky-700 shrink-0 mt-1" />
            <p className="text-sm text-slate-600">
              Estás postulando como{" "}
              <strong>{currentUser?.nombreCompleto || "usuario"}</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ApplicantJobDetail;