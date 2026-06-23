import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { userService } from "../../services/userService.js";

const ROLE_OPTIONS = [
  {
    id: 1,
    nombre: "ADMINISTRADOR",
    label: "Administrador",
  },
  {
    id: 2,
    nombre: "RECURSOS_HUMANOS",
    label: "Recursos Humanos",
  },
  {
    id: 3,
    nombre: "LIDER_TECNICO",
    label: "Líder técnico",
  },
];

const initialForm = {
  nombres: "",
  apellidos: "",
  correo: "",
  password: "",
  confirmarPassword: "",
  rolId: "2",
  correoVerificado: true,
  debeCambiarPassword: true,
};

function AdminCreateUser() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 4500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!form.nombres.trim()) return "Ingresa los nombres del usuario.";

    if (form.nombres.trim().length < 2) {
      return "Los nombres deben tener al menos 2 caracteres.";
    }

    if (!form.apellidos.trim()) return "Ingresa los apellidos del usuario.";

    if (form.apellidos.trim().length < 2) {
      return "Los apellidos deben tener al menos 2 caracteres.";
    }

    if (!form.correo.trim()) return "Ingresa el correo del usuario.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.correo.trim())) {
      return "Ingresa un correo válido.";
    }

    if (!form.password) return "Ingresa una contraseña temporal.";

    if (form.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }

    if (form.password !== form.confirmarPassword) {
      return "Las contraseñas no coinciden.";
    }

    if (!form.rolId) return "Selecciona un rol.";

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
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      correo: form.correo.trim().toLowerCase(),
      password: form.password,
      rolId: Number(form.rolId),
      correoVerificado: Boolean(form.correoVerificado),
      debeCambiarPassword: Boolean(form.debeCambiarPassword),
    };

    try {
      setSaving(true);

      await userService.create(payload);

      showMessage("Usuario creado correctamente.", "success");

      setTimeout(() => {
        navigate("/admin/usuarios");
      }, 900);
    } catch (error) {
      showMessage(error.userMessage || "No se pudo crear el usuario.", "error");
    } finally {
      setSaving(false);
    }
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
        description="Registra usuarios internos para que puedan acceder al sistema según su rol."
      />

      {message && (
        <div
          className={`mb-5 border rounded-2xl px-4 py-3 text-sm font-semibold ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <Link
        to="/admin/usuarios"
        className="inline-flex items-center gap-2 text-rose-700 font-black mb-5"
      >
        <ArrowLeft size={18} />
        Volver a usuarios
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-black text-slate-900">
            Datos del usuario
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Estos datos serán usados para iniciar sesión en la plataforma.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Nombres *
              </label>

              <div className="relative">
                <UserRound
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-600 pointer-events-none"
                />

                <input
                  name="nombres"
                  value={form.nombres}
                  onChange={handleChange}
                  placeholder="Ej: Ana"
                  className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-11 outline-none bg-white text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Apellidos *
              </label>

              <input
                name="apellidos"
                value={form.apellidos}
                onChange={handleChange}
                placeholder="Ej: Torres Pérez"
                className="input-light"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Correo *
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-600 pointer-events-none"
                />

                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="usuario@empresa.com"
                  className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-11 outline-none bg-white text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <h2 className="text-xl font-black text-slate-900">
            Acceso y permisos
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Define el rol y la contraseña temporal del usuario.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Rol *
              </label>

              <div className="relative">
                <ShieldCheck
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-600 pointer-events-none"
                />

                <select
                  name="rolId"
                  value={form.rolId}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-11 outline-none bg-white text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-slate-500 mt-2">
                El administrador crea solo usuarios internos. Los postulantes se
                registran desde la página pública.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Contraseña temporal *
              </label>

              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-600 pointer-events-none"
                />

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-11 outline-none bg-white text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Confirmar contraseña *
              </label>

              <input
                type="password"
                name="confirmarPassword"
                value={form.confirmarPassword}
                onChange={handleChange}
                placeholder="Repite la contraseña"
                className="input-light"
              />
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <p className="font-black text-slate-900 mb-3">
                Configuración inicial
              </p>

              <label className="flex items-start gap-3 text-sm text-slate-700 mb-3">
                <input
                  type="checkbox"
                  name="correoVerificado"
                  checked={form.correoVerificado}
                  onChange={handleChange}
                  className="mt-1 accent-rose-600"
                />
                <span>
                  Marcar correo como verificado. Útil para usuarios internos
                  creados por el administrador.
                </span>
              </label>

              <label className="flex items-start gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="debeCambiarPassword"
                  checked={form.debeCambiarPassword}
                  onChange={handleChange}
                  className="mt-1 accent-rose-600"
                />
                <span>
                  Solicitar cambio de contraseña en el primer inicio de sesión.
                </span>
              </label>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex flex-col md:flex-row md:items-start gap-3">
            <ShieldCheck size={22} className="text-rose-600 shrink-0 mt-1" />

            <div>
              <h2 className="font-black text-slate-900">Nota de seguridad</h2>

              <p className="text-sm text-slate-600 mt-1">
                El usuario recibirá una contraseña temporal asignada por el
                administrador. Si está activa la opción de cambio obligatorio,
                deberá actualizarla al ingresar.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col md:flex-row justify-end gap-3">
          <Link
            to="/admin/usuarios"
            className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl text-sm font-black"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white px-5 py-3 rounded-xl text-sm font-black"
          >
            <Save size={17} />
            {saving ? "Guardando..." : "Crear usuario"}
          </button>
        </section>
      </form>
    </div>
  );
}

export default AdminCreateUser;