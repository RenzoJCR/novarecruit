import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Mail,
  ShieldCheck,
  LockKeyhole,
  CheckCircle2,
  Save,
  Sparkles,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { useData } from "../../context/DataContext.jsx";

const initialForm = {
  name: "",
  email: "",
  role: "RECURSOS_HUMANOS",
  password: "",
  confirmPassword: "",
};

const inputWithIconClass =
  "w-full border border-slate-300 rounded-xl py-3 pr-4 pl-12 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

function AdminCreateUser() {
  const navigate = useNavigate();
  const { createSystemUser } = useData();

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

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setMessage("Completa todos los campos obligatorios.");
      setMessageType("error");
      return;
    }

    if (form.password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      setMessageType("error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      setMessageType("error");
      return;
    }

    createSystemUser({
      name: form.name,
      email: form.email,
      role: form.role,
      temporaryPassword: form.password,
      mustChangePassword: true,
    });

    setMessage("Usuario creado correctamente con contraseña temporal.");
    setMessageType("success");

    setTimeout(() => {
      navigate("/admin/usuarios");
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
        title="Crear usuario"
        description="Registra usuarios internos para operar el sistema según su rol asignado."
      />

      {message && (
        <div
          className={`mb-5 border rounded-3xl px-5 py-4 font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-7 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-7">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center">
              <UserPlus size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Datos del usuario
              </h2>
              <p className="text-sm text-slate-500">
                Información de acceso para usuarios internos.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Nombre completo *
              </label>
              <div className="relative">
                <UserPlus
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej: Ana Gutiérrez"
                  className={inputWithIconClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Correo institucional *
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@novatech.com"
                  className={inputWithIconClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Rol *
              </label>
              <div className="relative">
                <ShieldCheck
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={inputWithIconClass}
                >
                  <option value="ADMINISTRADOR">Administrador</option>
                  <option value="RECURSOS_HUMANOS">Recursos Humanos</option>
                  <option value="LIDER_TECNICO">Líder Técnico</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Estado inicial
              </label>
              <div className="relative">
                <CheckCircle2
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                />
                <input
                  value="Activo"
                  disabled
                  className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-12 outline-none bg-slate-100 text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Contraseña temporal *
              </label>
              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className={inputWithIconClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Confirmar contraseña *
              </label>
              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite la contraseña"
                  className={inputWithIconClass}
                />
              </div>
            </div>
          </div>

          <div className="mt-7 rounded-3xl bg-gradient-to-br from-emerald-50 to-sky-50 border border-emerald-100 p-5">
            <div className="flex items-start gap-3">
              <Sparkles size={22} className="text-emerald-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-black text-slate-900">
                  Contraseña temporal
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  En esta versión frontend se simulan las credenciales. En la
                  implementación real, Spring Boot cifrará la contraseña con
                  BCrypt antes de guardarla en MySQL.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-7 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20"
          >
            <Save size={18} />
            Crear usuario
          </button>
        </form>

        <aside className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-7 shadow-sm h-fit">
          <h2 className="text-2xl font-black text-slate-900">
            Roles disponibles
          </h2>

          <p className="text-slate-500 mt-2 text-sm">
            Cada usuario interno tendrá acceso a módulos específicos según su rol.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-black text-slate-900">Administrador</p>
              <p className="text-sm text-slate-500 mt-1">
                Gestiona usuarios, áreas, reportes y configuración.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-black text-slate-900">Recursos Humanos</p>
              <p className="text-sm text-slate-500 mt-1">
                Crea vacantes, revisa CVs y filtra postulantes.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-black text-slate-900">Líder Técnico</p>
              <p className="text-sm text-slate-500 mt-1">
                Crea evaluaciones y revisa resultados técnicos.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AdminCreateUser;