import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Save } from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import { getHomeByRole } from "../../utils/roleRedirect.js";

const initialForm = {
  passwordActual: "",
  nuevaPassword: "",
  confirmarPassword: "",
};

function ChangePassword() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, changePassword, loadingAuth } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
  };

  const validateForm = () => {
    if (!isAuthenticated) return "Debes iniciar sesión nuevamente.";
    if (!form.passwordActual) return "Ingresa tu contraseña actual.";
    if (!form.nuevaPassword) return "Ingresa tu nueva contraseña.";

    if (form.nuevaPassword.length < 8) {
      return "La nueva contraseña debe tener al menos 8 caracteres.";
    }

    if (form.nuevaPassword !== form.confirmarPassword) {
      return "Las contraseñas no coinciden.";
    }

    if (form.passwordActual === form.nuevaPassword) {
      return "La nueva contraseña no puede ser igual a la actual.";
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

    try {
      const response = await changePassword({
        passwordActual: form.passwordActual,
        nuevaPassword: form.nuevaPassword,
      });

      showMessage(response.message || "Contraseña actualizada.", "success");

      setTimeout(() => {
        navigate(getHomeByRole(response.rolNombre), { replace: true });
      }, 900);
    } catch (error) {
      showMessage(error.userMessage || "No se pudo cambiar la contraseña.", "error");
    }
  };

  const alertStyles = {
    info: "bg-sky-50 border-sky-200 text-sky-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white/95 border border-slate-200 rounded-[2rem] p-8 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-sky-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
            <LockKeyhole size={30} />
          </div>

          <h1 className="text-3xl font-black text-slate-900">
            Cambiar contraseña
          </h1>

          <p className="text-slate-500 mt-2">
            {currentUser?.debeCambiarPassword
              ? "Debes cambiar tu contraseña temporal antes de continuar."
              : "Actualiza tu contraseña de acceso."}
          </p>

          {message && (
            <div
              className={`mt-5 border rounded-3xl px-5 py-4 font-semibold ${alertStyles[messageType]}`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Contraseña actual
              </label>

              <input
                type="password"
                name="passwordActual"
                value={form.passwordActual}
                onChange={handleChange}
                placeholder="Contraseña actual"
                className="input-light"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Nueva contraseña
              </label>

              <input
                type="password"
                name="nuevaPassword"
                value={form.nuevaPassword}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                className="input-light"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Confirmar nueva contraseña
              </label>

              <input
                type="password"
                name="confirmarPassword"
                value={form.confirmarPassword}
                onChange={handleChange}
                placeholder="Repite la nueva contraseña"
                className="input-light"
              />
            </div>

            <button
              type="submit"
              disabled={loadingAuth}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 disabled:from-slate-300 disabled:to-slate-300 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20 disabled:shadow-none"
            >
              <Save size={18} />
              {loadingAuth ? "Guardando..." : "Cambiar contraseña"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;