import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FileText, UserPlus, CheckCircle2 } from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";

const initialForm = {
  names: "",
  lastnames: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  cvUrl: "",
  summary: "",
  password: "",
  confirmPassword: "",
};

function Register() {
  const navigate = useNavigate();
  const { registerApplicant } = useAuth();

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

  const validateForm = () => {
    if (
      !form.names ||
      !form.lastnames ||
      !form.email ||
      !form.phone ||
      !form.cvUrl ||
      !form.password ||
      !form.confirmPassword
    ) {
      return "Completa los campos obligatorios.";
    }

    if (form.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }

    if (form.password !== form.confirmPassword) {
      return "Las contraseñas no coinciden.";
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const error = validateForm();

    if (error) {
      setMessage(error);
      setMessageType("error");
      return;
    }

    registerApplicant(form);

    setMessage("Cuenta creada correctamente. Redirigiendo al panel...");
    setMessageType("success");

    setTimeout(() => {
      navigate("/applicant/dashboard");
    }, 900);
  };

  const alertStyles = {
    info: "bg-sky-500/10 border-sky-500/30 text-sky-300",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    error: "bg-rose-500/10 border-rose-500/30 text-rose-300",
  };

  return (
    <section className="px-6 py-12 flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-8">
        <form
          onSubmit={handleSubmit}
          className="glass-card rounded-[2rem] p-8 shadow-2xl"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-300/20 text-emerald-300 text-sm font-semibold mb-6">
            <UserPlus size={16} />
            Registro de postulante
          </span>

          <h1 className="text-4xl font-black mb-3">
            Crea tu perfil en <span className="gradient-text">NovaRecruit</span>
          </h1>

          <p className="text-slate-400 mb-8 leading-relaxed">
            Registra tu información profesional una sola vez. Luego podrás
            postular a diferentes vacantes sin duplicar tus datos.
          </p>

          {message && (
            <div
              className={`mb-5 border rounded-2xl px-5 py-4 font-semibold ${alertStyles[messageType]}`}
            >
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm mb-2 text-slate-300 font-semibold">
                Nombres *
              </label>
              <input
                name="names"
                value={form.names}
                onChange={handleChange}
                className="input-dark"
                placeholder="Carlos"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-300 font-semibold">
                Apellidos *
              </label>
              <input
                name="lastnames"
                value={form.lastnames}
                onChange={handleChange}
                className="input-dark"
                placeholder="Mendoza"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-300 font-semibold">
                Correo *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-dark"
                placeholder="correo@email.com"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-300 font-semibold">
                Teléfono *
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input-dark"
                placeholder="+51 987 654 321"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-300 font-semibold">
                LinkedIn
              </label>
              <input
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                className="input-dark"
                placeholder="linkedin.com/in/usuario"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-300 font-semibold">
                GitHub
              </label>
              <input
                name="github"
                value={form.github}
                onChange={handleChange}
                className="input-dark"
                placeholder="github.com/usuario"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-slate-300 font-semibold">
                URL del CV *
              </label>
              <input
                name="cvUrl"
                value={form.cvUrl}
                onChange={handleChange}
                className="input-dark"
                placeholder="https://drive.google.com/..."
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-300 font-semibold">
                Contraseña *
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input-dark"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-300 font-semibold">
                Confirmar contraseña *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="input-dark"
                placeholder="Repite la contraseña"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-slate-300 font-semibold">
                Resumen profesional
              </label>
              <textarea
                name="summary"
                value={form.summary}
                onChange={handleChange}
                className="input-dark min-h-32"
                placeholder="Cuéntanos brevemente tu experiencia..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20 transition-all"
          >
            Crear cuenta
            <ArrowRight size={18} />
          </button>
        </form>

        <aside className="glass-card rounded-[2rem] p-8 h-fit shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-400 text-slate-950 flex items-center justify-center mb-6">
            <FileText size={28} />
          </div>

          <h2 className="text-2xl font-black">Tu perfil será reutilizado</h2>

          <p className="text-slate-400 mt-4 leading-relaxed">
            Al postular, NovaRecruit usará tus datos de perfil, CV, LinkedIn y
            GitHub automáticamente. Solo declararás tu nivel en las habilidades
            requeridas por la vacante.
          </p>

          <div className="mt-7 space-y-4">
            {[
              "Datos personales centralizados",
              "CV registrado como URL",
              "Postulaciones sin duplicar información",
              "Evaluaciones técnicas asignadas por líder técnico",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 size={19} className="text-emerald-300" />
                <span className="text-sm text-slate-300 font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl bg-slate-950/70 border border-white/10 p-5">
            <p className="text-sm text-emerald-300 font-bold">
              Flujo del postulante
            </p>
            <p className="text-sm text-slate-400 mt-2">
              Registro → Vacantes → Postulación → Evaluación → Resultado del
              proceso.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Register;