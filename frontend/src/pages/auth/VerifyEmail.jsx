import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, MailCheck, RefreshCw } from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import { getHomeByRole } from "../../utils/roleRedirect.js";

function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail, resendCode, loadingAuth } = useAuth();

  const initialCorreo = searchParams.get("correo") || "";

  const [correo, setCorreo] = useState(initialCorreo);
  const [codigo, setCodigo] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!correo.trim()) {
      showMessage("Ingresa tu correo.", "error");
      return;
    }

    if (!codigo.trim()) {
      showMessage("Ingresa el código de verificación.", "error");
      return;
    }

    try {
      const response = await verifyEmail({
        correo: correo.trim().toLowerCase(),
        codigo: codigo.trim(),
      });

      showMessage(response.message || "Correo verificado correctamente.", "success");

      setTimeout(() => {
        if (response.debeCambiarPassword) {
          navigate("/change-password", { replace: true });
          return;
        }

        navigate(getHomeByRole(response.rolNombre), { replace: true });
      }, 900);
    } catch (error) {
      showMessage(error.userMessage || "No se pudo verificar el correo.", "error");
    }
  };

  const handleResend = async () => {
    if (!correo.trim()) {
      showMessage("Ingresa tu correo para reenviar el código.", "error");
      return;
    }

    try {
      const response = await resendCode({
        correo: correo.trim().toLowerCase(),
      });

      showMessage(response.message || "Código reenviado.", "success");
    } catch (error) {
      showMessage(error.userMessage || "No se pudo reenviar el código.", "error");
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
            <MailCheck size={30} />
          </div>

          <h1 className="text-3xl font-black text-slate-900">
            Verificar correo
          </h1>

          <p className="text-slate-500 mt-2">
            Ingresa el código de 6 dígitos enviado a tu correo. Si no tienes
            correo real configurado, revisa la consola del backend.
          </p>

          {message && (
            <div
              className={`mt-5 border rounded-3xl px-5 py-4 font-semibold ${alertStyles[messageType]}`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleVerify} className="mt-7 space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Correo
              </label>

              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="input-light"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Código
              </label>

              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="input-light text-center text-2xl tracking-[0.4em] font-black"
              />
            </div>

            <button
              type="submit"
              disabled={loadingAuth}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 disabled:from-slate-300 disabled:to-slate-300 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20 disabled:shadow-none"
            >
              <CheckCircle2 size={18} />
              {loadingAuth ? "Verificando..." : "Verificar correo"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={loadingAuth}
              className="w-full inline-flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-black"
            >
              <RefreshCw size={18} />
              Reenviar código
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            ¿Ya verificaste?{" "}
            <Link to="/login" className="font-black text-emerald-700">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;