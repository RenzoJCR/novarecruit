import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Mail,
  ShieldCheck,
  LockKeyhole,
  CheckCircle2,
  Save,
  Sparkles,
  Phone,
  X,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { userService } from "../../services/userService.js";
import { roleService } from "../../services/roleService.js";

const initialForm = {
  nombres: "",
  apellidos: "",
  correo: "",
  telefono: "",
  password: "",
  confirmPassword: "",
  rolId: "",
  estado: true,
};

const inputWithIconClass =
  "w-full border border-slate-300 rounded-xl py-3 pr-4 pl-12 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";

function AdminCreateUser() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [loadingRoles, setLoadingRoles] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoadingRoles(true);
      const data = await roleService.getActive();
      setRoles(data);

      if (data.length > 0) {
        const rrhhRole = data.find((role) => role.nombre === "RECURSOS_HUMANOS");

        setForm((prevForm) => ({
          ...prevForm,
          rolId: rrhhRole ? rrhhRole.id : data[0].id,
        }));
      }
    } catch (error) {
      showMessage(error.userMessage || "No se pudieron cargar los roles.", "error");
    } finally {
      setLoadingRoles(false);
    }
  };

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 3500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!form.nombres.trim()) return "Ingresa los nombres del usuario.";
    if (form.nombres.trim().length < 2) return "Los nombres deben tener al menos 2 caracteres.";

    if (!form.apellidos.trim()) return "Ingresa los apellidos del usuario.";
    if (form.apellidos.trim().length < 2) return "Los apellidos deben tener al menos 2 caracteres.";

    if (!form.correo.trim()) return "Ingresa el correo del usuario.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.correo.trim())) return "Ingresa un correo válido.";

    if (!form.password) return "Ingresa una contraseña temporal.";
    if (form.password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";

    if (form.password !== form.confirmPassword) return "Las contraseñas no coinciden.";

    if (!form.rolId) return "Selecciona un rol para el usuario.";

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
      telefono: form.telefono.trim() || null,
      fotoPerfil: null,
      estado: form.estado,
      rolId: Number(form.rolId),
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
                Nombres *
              </label>
              <div className="relative">
                <UserPlus
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                />
                <input
                  name="nombres"
                  value={form.nombres}
                  onChange={handleChange}
                  placeholder="Ej: Ana"
                  className={inputWithIconClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Apellidos *
              </label>
              <div className="relative">
                <UserPlus
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                />
                <input
                  name="apellidos"
                  value={form.apellidos}
                  onChange={handleChange}
                  placeholder="Ej: Gutiérrez"
                  className={inputWithIconClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Correo *
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                />
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="correo@novatech.com"
                  className={inputWithIconClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
                />
                <input
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="+51 999 888 777"
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
                  name="rolId"
                  value={form.rolId}
                  onChange={handleChange}
                  className={inputWithIconClass}
                  disabled={loadingRoles}
                >
                  {loadingRoles ? (
                    <option value="">Cargando roles...</option>
                  ) : (
                    roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.nombre}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer">
              <input
                type="checkbox"
                name="estado"
                checked={form.estado}
                onChange={handleChange}
                className="accent-emerald-500"
              />
              <div>
                <p className="font-black text-slate-900">Usuario activo</p>
                <p className="text-sm text-slate-500">
                  Permitirá usar el sistema.
                </p>
              </div>
            </label>

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
                  placeholder="Mínimo 8 caracteres"
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
                  Datos reales desde MySQL
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Esta pantalla crea usuarios mediante Spring Boot y registra la
                  acción en logs del sistema.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-col md:flex-row gap-3">
            <button
              type="submit"
              disabled={saving || loadingRoles}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 disabled:from-slate-300 disabled:to-slate-300 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20 disabled:shadow-none"
            >
              <Save size={18} />
              {saving ? "Creando..." : "Crear usuario"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/usuarios")}
              className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-black"
            >
              <X size={18} />
              Cancelar
            </button>
          </div>
        </form>

        <aside className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-7 shadow-sm h-fit">
          <h2 className="text-2xl font-black text-slate-900">
            Roles disponibles
          </h2>

          <p className="text-slate-500 mt-2 text-sm">
            Cada usuario tendrá acceso a módulos específicos según el rol asignado.
          </p>

          <div className="mt-6 space-y-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="font-black text-slate-900">{role.nombre}</p>
                <p className="text-sm text-slate-500 mt-1">
                  {role.descripcion}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl bg-emerald-50 border border-emerald-100 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={22}
                className="text-emerald-600 shrink-0 mt-1"
              />
              <p className="text-sm text-slate-600">
                En una siguiente etapa, estas credenciales se protegerán con
                JWT y contraseñas cifradas con BCrypt.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AdminCreateUser;