import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, LogIn, Mail, Sparkles } from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import { getHomeByRole } from "../../utils/roleRedirect.js";

const initialForm = {
  correo: "",
  password: "",
};

function Login() {
  const navigate = useNavigate();
  const { login, loadingAuth } = useAuth();

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
    if (!form.correo.trim()) return "Ingresa tu correo.";
    if (!form.password.trim()) return "Ingresa tu contraseña.";

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
      const response = await login({
        correo: form.correo.trim().toLowerCase(),
        password: form.password,
      });

      if (!response.token && response.correoVerificado === false) {
        showMessage(response.message, "info");

        setTimeout(() => {
          navigate(
            `/verify-email?correo=${encodeURIComponent(
              form.correo.trim().toLowerCase()
            )}`
          );
        }, 900);

        return;
      }

      if (response.debeCambiarPassword) {
        navigate("/change-password", { replace: true });
        return;
      }

      navigate(getHomeByRole(response.rolNombre), { replace: true });
    } catch (error) {
      showMessage(error.userMessage || "No se pudo iniciar sesión.", "error");
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
            <LogIn size={30} />
          </div>

          <h1 className="text-3xl font-black text-slate-900">
            Iniciar sesión
          </h1>

          <p className="text-slate-500 mt-2">
            Accede a NovaRecruit según tu rol.
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
                Correo
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"
                />
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-12 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Contraseña
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"
                />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Tu contraseña"
                  className="w-full border border-slate-300 rounded-xl py-3 pr-4 pl-12 outline-none bg-white text-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingAuth}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 disabled:from-slate-300 disabled:to-slate-300 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20 disabled:shadow-none"
            >
              <LogIn size={18} />
              {loadingAuth ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <div className="mt-6 rounded-3xl bg-emerald-50 border border-emerald-100 p-4">
            <div className="flex items-start gap-3">
              <Sparkles size={20} className="text-emerald-600 shrink-0 mt-1" />
              <p className="text-sm text-slate-600">
                Si eres postulante nuevo, crea tu cuenta y verifica tu correo
                con el código recibido.
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="font-black text-emerald-700">
              Regístrate como postulante
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;