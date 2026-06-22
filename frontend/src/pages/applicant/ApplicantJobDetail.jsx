import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  DollarSign,
  FileText,
  MapPin,
  Send,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { vacanteService } from "../../services/vacanteService.js";
import { postulacionService } from "../../services/postulacionService.js";
import { useAuth } from "../../context/AuthContext.jsx";

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
      return "No se encontró el usuario autenticado. Inicia sesión nuevamente.";
    }

    if (!vacante) return "No se encontró la vacante.";

    if (vacante.estado !== "ACTIVA" && vacante.estado !== "EN_PROCESO") {
      return "Esta vacante no está disponible para postular.";
    }

    if (declaredSkills.length === 0) {
      return "Debes declarar al menos una habilidad.";
    }

    const hasInvalidSkill = declaredSkills.some(
      (item) => !item.habilidadId || !item.nivelPostulante
    );

    if (hasInvalidSkill) {
      return "Completa correctamente las habilidades declaradas.";
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

  const formatDate = (value) => {
    if (!value) return "Sin fecha";

    return new Date(`${value}T00:00:00`).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  const formatMoney = (value) => {
    if (value === null || value === undefined) return "No especificado";

    return Number(value).toLocaleString("es-PE", {
      style: "currency",
      currency: "PEN",
    });
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
          description="Cargando información desde el backend."
        />

        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
          <h2 className="text-2xl font-black text-slate-900">
            Cargando vacante...
          </h2>
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
          className="inline-flex items-center gap-2 text-emerald-700 font-black"
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
        description="Revisa los requisitos y completa tu postulación."
      />

      {message && (
        <div
          className={`mb-5 border rounded-3xl px-5 py-4 font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <Link
        to="/applicant/vacantes"
        className="inline-flex items-center gap-2 text-emerald-700 font-black mb-6"
      >
        <ArrowLeft size={18} />
        Volver a vacantes
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_390px] gap-6">
        <section className="space-y-6">
          <div className="bg-white/95 border border-slate-200 rounded-[2rem] p-7 shadow-sm">
            <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black mb-4">
              {vacante.areaNombre}
            </span>

            <h1 className="text-4xl font-black text-slate-900">
              {vacante.titulo}
            </h1>

            <p className="text-slate-500 mt-4 leading-relaxed">
              {vacante.descripcion}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-7">
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4 flex items-center gap-3">
                <MapPin size={20} className="text-emerald-600" />
                <div>
                  <p className="text-xs font-black text-slate-500">Modalidad</p>
                  <p className="font-bold text-slate-900">
                    {vacante.modalidad} · {vacante.ubicacion || "Sin ubicación"}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4 flex items-center gap-3">
                <DollarSign size={20} className="text-emerald-600" />
                <div>
                  <p className="text-xs font-black text-slate-500">Salario</p>
                  <p className="font-bold text-slate-900">
                    {formatMoney(vacante.salario)}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4 flex items-center gap-3">
                <Calendar size={20} className="text-emerald-600" />
                <div>
                  <p className="text-xs font-black text-slate-500">
                    Fecha de cierre
                  </p>
                  <p className="font-bold text-slate-900">
                    {formatDate(vacante.fechaCierre)}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4 flex items-center gap-3">
                <Briefcase size={20} className="text-emerald-600" />
                <div>
                  <p className="text-xs font-black text-slate-500">
                    Experiencia
                  </p>
                  <p className="font-bold text-slate-900">
                    {vacante.nivelExperiencia}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/95 border border-slate-200 rounded-[2rem] p-7 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Requisitos técnicos
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Declara tu nivel actual para cada habilidad solicitada.
            </p>

            <div className="space-y-4">
              {requiredSkills.map((skill, index) => (
                <div
                  key={skill.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_180px_160px] gap-4 rounded-3xl bg-slate-50 border border-slate-200 p-4"
                >
                  <div>
                    <p className="text-xs font-black text-slate-500">
                      Habilidad requerida
                    </p>
                    <p className="font-black text-slate-900 mt-1">
                      {skill.habilidadNombre}
                    </p>
                    <p className="text-sm text-slate-500">
                      Nivel solicitado: {skill.nivelRequerido} ·{" "}
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
                      Años exp.
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
          </div>
        </section>

        <aside className="bg-white/95 border border-slate-200 rounded-[2rem] p-7 shadow-sm h-fit">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center mb-5">
            <Send size={25} />
          </div>

          <h2 className="text-2xl font-black text-slate-900">
            Enviar postulación
          </h2>

          <p className="text-slate-500 mt-2 text-sm">
            Tu postulación se registrará en MySQL y RRHH podrá revisarla desde
            su panel.
          </p>

          <div className="mt-6 rounded-3xl bg-emerald-50 border border-emerald-100 p-4">
            <div className="flex gap-3">
              <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
              <p className="text-sm text-slate-600">
                Al postular, se generará una notificación y un log de actividad.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApply}
            disabled={sending}
            className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 disabled:from-slate-300 disabled:to-slate-300 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20 disabled:shadow-none"
          >
            <Send size={18} />
            {sending ? "Enviando..." : "Postular ahora"}
          </button>

          <div className="mt-6 rounded-3xl bg-slate-50 border border-slate-200 p-4">
            <div className="flex items-start gap-3">
              <FileText size={20} className="text-emerald-600 shrink-0 mt-1" />
              <p className="text-sm text-slate-600">
                Estás postulando como{" "}
                <strong>{currentUser?.nombreCompleto || "usuario autenticado"}</strong>.
                Esta acción quedará asociada a tu cuenta.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ApplicantJobDetail;