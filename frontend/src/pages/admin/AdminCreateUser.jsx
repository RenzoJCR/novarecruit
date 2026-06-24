import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LockKeyhole,
  Mail,
  Phone,
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
  telefono: "",
  password: "",
  confirmarPassword: "",
  rolId: "2",
  correoVerificado: true,
  debeCambiarPassword: true,
};

function isValidPersonName(value) {
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ' -]+$/.test(value.trim());
}

function hasOnlySpaces(value) {
  return value.length > 0 && value.trim().length === 0;
}

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

    if (name === "nombres" || name === "apellidos") {
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ' -]*$/;

      if (!nameRegex.test(value)) {
        return;
      }
    }

    if (name === "correo" && /\s/.test(value)) {
      return;
    }

    if (name === "telefono") {
      const phoneRegex = /^\d{0,9}$/;

      if (!phoneRegex.test(value)) {
        return;
      }
    }

    if (
      (name === "password" || name === "confirmarPassword") &&
      /\s/.test(value)
    ) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const nombres = form.nombres.trim();
    const apellidos = form.apellidos.trim();
    const correo = form.correo.trim().toLowerCase();
    const telefono = form.telefono.trim();
    const password = form.password;
    const confirmarPassword = form.confirmarPassword;

    if (!nombres) return "Ingresa los nombres del usuario.";

    if (hasOnlySpaces(form.nombres)) {
      return "Los nombres no pueden contener solo espacios.";
    }

    if (nombres.length < 2) {
      return "Los nombres deben tener al menos 2 caracteres.";
    }

    if (!isValidPersonName(nombres)) {
      return "Los nombres solo deben contener letras, espacios, guion o apóstrofe.";
    }

    if (!apellidos) return "Ingresa los apellidos del usuario.";

    if (hasOnlySpaces(form.apellidos)) {
      return "Los apellidos no pueden contener solo espacios.";
    }

    if (apellidos.length < 2) {
      return "Los apellidos deben tener al menos 2 caracteres.";
    }

    if (!isValidPersonName(apellidos)) {
      return "Los apellidos solo deben contener letras, espacios, guion o apóstrofe.";
    }

    if (!correo) return "Ingresa el correo del usuario.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(correo)) {
      return "Ingresa un correo válido.";
    }

    if (!telefono) {
      return "Ingresa el número de celular del usuario.";
    }

    if (!/^\d+$/.test(telefono)) {
      return "El celular solo debe contener números.";
    }

    if (telefono.length !== 9) {
      return "El celular debe tener 9 dígitos.";
    }

    if (!telefono.startsWith("9")) {
      return "El celular debe iniciar con 9.";
    }

    if (!password) return "Ingresa una contraseña temporal.";

    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }

    if (password.includes(" ")) {
      return "La contraseña no debe contener espacios.";
    }

    if (!confirmarPassword) {
      return "Confirma la contraseña temporal.";
    }

    if (password !== confirmarPassword) {
      return "Las contraseñas no coinciden.";
    }

    if (!form.rolId) return "Selecciona un rol.";

    const selectedRoleExists = ROLE_OPTIONS.some(
      (role) => Number(role.id) === Number(form.rolId)
    );

    if (!selectedRoleExists) {
      return "Selecciona un rol válido.";
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
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      correo: form.correo.trim().toLowerCase(),
      telefono: form.telefono.trim(),
      password: form.password,
      rolId: Number(form.rolId),
      estado: true,
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
            Estos datos serán usados para identificar al usuario dentro del
            sistema.
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
                  maxLength={100}
                  className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-11 outline-none bg-white text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Solo letras, espacios, guion o apóstrofe.
              </p>
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
                maxLength={100}
                className="input-light"
              />

              <p className="text-xs text-slate-400 mt-1">
                Solo letras, espacios, guion o apóstrofe.
              </p>
            </div>

            <div>
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
                  maxLength={120}
                  className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-11 outline-none bg-white text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <p className="text-xs text-slate-400 mt-1">
                No debe contener espacios.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Celular *
              </label>

              <div className="relative">
                <Phone
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-600 pointer-events-none"
                />

                <input
                  type="text"
                  inputMode="numeric"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="Ej: 987654321"
                  maxLength={9}
                  className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-11 outline-none bg-white text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Debe tener 9 dígitos e iniciar con 9.
              </p>
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
                  placeholder="Mínimo 8 caracteres"
                  maxLength={60}
                  className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-11 outline-none bg-white text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Mínimo 8 caracteres y sin espacios.
              </p>
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
                maxLength={60}
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