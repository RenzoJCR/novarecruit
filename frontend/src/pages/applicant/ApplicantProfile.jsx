import { useEffect, useState } from "react";
import {
  Bell,
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  KeyRound,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { userService } from "../../services/userService.js";

function getRoleLabel(roleName) {
  const labels = {
    ADMINISTRADOR: "Administrador",
    RECURSOS_HUMANOS: "Recursos Humanos",
    LIDER_TECNICO: "Líder Técnico",
    POSTULANTE: "Postulante",
  };

  return labels[roleName] || roleName || "Postulante";
}

function getInitials(name) {
  if (!name) return "US";

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ApplicantProfile() {
  const { currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [message, setMessage] = useState("");

  const loadProfile = async () => {
    if (!currentUser?.id) return;

    try {
      setLoadingProfile(true);
      setMessage("");

      /*
       * El currentUser del login puede traer datos básicos.
       * Aquí consultamos el usuario completo para obtener campos como teléfono.
       */
      const data = await userService.getById(currentUser.id);
      setProfileUser(data);
    } catch (error) {
      setMessage(
        error.userMessage ||
          "No se pudieron cargar los datos completos del perfil."
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [currentUser?.id]);

  const user = profileUser || currentUser || {};

  const nombreCompleto =
    user.nombreCompleto ||
    `${user.nombres || ""} ${user.apellidos || ""}`.trim() ||
    "Usuario postulante";

  const correo = user.correo || "Correo no disponible";
  const telefono = user.telefono?.trim() || "No registrado";
  const rolNombre = user.rolNombre || "POSTULANTE";

  const correoVerificado = Boolean(user.correoVerificado);
  const debeCambiarPassword = Boolean(user.debeCambiarPassword);

  const initials = getInitials(nombreCompleto);

  return (
    <div>
      <SectionHeader
        title="Mi perfil"
        description="Consulta la información básica asociada a tu cuenta de postulante."
        action={
          <button
            type="button"
            onClick={loadProfile}
            disabled={loadingProfile}
            className="inline-flex items-center gap-2 border border-slate-300 hover:bg-slate-50 disabled:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-black"
          >
            <RefreshCw size={17} />
            {loadingProfile ? "Actualizando..." : "Actualizar"}
          </button>
        }
      />

      {message && (
        <div className="mb-5 border border-amber-200 bg-amber-50 text-amber-700 rounded-2xl px-4 py-3 text-sm font-semibold">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-1 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="w-24 h-24 rounded-3xl bg-sky-600 text-white flex items-center justify-center text-3xl font-black">
            {initials}
          </div>

          <h2 className="text-2xl font-black text-slate-900 mt-5">
            {nombreCompleto}
          </h2>

          <p className="text-sm font-bold text-slate-500 mt-1">
            {getRoleLabel(rolNombre)}
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3 text-slate-600">
              <Mail size={18} className="text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-slate-400 uppercase">
                  Correo
                </p>
                <p className="text-sm font-semibold break-all">{correo}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-slate-600">
              <Phone size={18} className="text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-slate-400 uppercase">
                  Teléfono
                </p>
                <p className="text-sm font-semibold">{telefono}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-slate-600">
              <UserRound size={18} className="text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-slate-400 uppercase">
                  Rol
                </p>
                <p className="text-sm font-semibold">
                  {getRoleLabel(rolNombre)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="text-xl font-black text-slate-900">
              Estado de la cuenta
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Información de seguridad y acceso de tu usuario.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div className="border border-slate-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      correoVerificado
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}
                  >
                    {correoVerificado ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <XCircle size={20} />
                    )}
                  </div>

                  <div>
                    <p className="font-black text-slate-900">
                      Correo electrónico
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      {correoVerificado
                        ? "Tu correo se encuentra verificado."
                        : "Tu correo aún no está verificado."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      debeCambiarPassword
                        ? "bg-amber-50 text-amber-700 border border-amber-100"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    }`}
                  >
                    <KeyRound size={20} />
                  </div>

                  <div>
                    <p className="font-black text-slate-900">Contraseña</p>

                    <p className="text-sm text-slate-500 mt-1">
                      {debeCambiarPassword
                        ? "Tienes pendiente cambiar tu contraseña inicial."
                        : "No tienes cambios de contraseña pendientes."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={20}
                  className="text-slate-500 shrink-0 mt-0.5"
                />

                <p className="text-sm text-slate-600">
                  Esta información se usa para identificarte dentro del proceso
                  de reclutamiento y asociar tus postulaciones, evaluaciones y
                  notificaciones.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="text-xl font-black text-slate-900">
              Accesos rápidos
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Consulta tus procesos o actualiza datos importantes de tu cuenta.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <Link
                to="/applicant/postulaciones"
                className="border border-slate-200 hover:bg-slate-50 rounded-2xl p-4 flex items-start gap-3 transition"
              >
                <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <ClipboardList size={20} />
                </div>

                <div>
                  <p className="font-black text-slate-900">
                    Mis postulaciones
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Revisa el estado de las vacantes a las que postulaste.
                  </p>
                </div>
              </Link>

              <Link
                to="/applicant/evaluaciones"
                className="border border-slate-200 hover:bg-slate-50 rounded-2xl p-4 flex items-start gap-3 transition"
              >
                <div className="w-11 h-11 rounded-xl bg-violet-50 border border-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                  <BookOpenCheck size={20} />
                </div>

                <div>
                  <p className="font-black text-slate-900">Mis evaluaciones</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Resuelve o consulta tus evaluaciones técnicas asignadas.
                  </p>
                </div>
              </Link>

              <Link
                to="/notificaciones"
                className="border border-slate-200 hover:bg-slate-50 rounded-2xl p-4 flex items-start gap-3 transition"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Bell size={20} />
                </div>

                <div>
                  <p className="font-black text-slate-900">Notificaciones</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Consulta avisos importantes sobre tu proceso.
                  </p>
                </div>
              </Link>

              <Link
                to="/change-password"
                className="border border-slate-200 hover:bg-slate-50 rounded-2xl p-4 flex items-start gap-3 transition"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <KeyRound size={20} />
                </div>

                <div>
                  <p className="font-black text-slate-900">
                    Cambiar contraseña
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Actualiza tu contraseña de acceso al sistema.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ApplicantProfile;