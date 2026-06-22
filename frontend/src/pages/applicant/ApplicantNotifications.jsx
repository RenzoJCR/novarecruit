import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { notificacionService } from "../../services/notificacionService.js";

const TEMP_POSTULANTE_ID = 4;

function ApplicantNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificacionService.getByUsuario(TEMP_POSTULANTE_ID);
      setNotifications(data);
    } catch (error) {
      setMessage(error.userMessage || "No se pudieron cargar las notificaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (notification) => {
    try {
      await notificacionService.markAsRead(notification.id);
      await loadNotifications();
    } catch (error) {
      setMessage(error.userMessage || "No se pudo actualizar la notificación.");
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "Sin fecha";

    return new Date(value).toLocaleString("es-PE", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const typeStyles = {
    SISTEMA: "bg-slate-50 text-slate-700 border-slate-200",
    POSTULACION: "bg-sky-50 text-sky-700 border-sky-200",
    EVALUACION: "bg-violet-50 text-violet-700 border-violet-200",
    RESULTADO: "bg-emerald-50 text-emerald-700 border-emerald-200",
    MENSAJE: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div>
      <SectionHeader
        title="Notificaciones"
        description="Consulta las actualizaciones reales de tus postulaciones."
        action={
          <button
            onClick={loadNotifications}
            className="inline-flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-2xl font-black"
          >
            <RefreshCw size={18} />
            Actualizar
          </button>
        }
      />

      {message && (
        <div className="mb-5 border border-rose-200 bg-rose-50 text-rose-700 rounded-3xl px-5 py-4 font-semibold">
          {message}
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
          <h2 className="text-2xl font-black text-slate-900">
            Cargando notificaciones...
          </h2>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 text-center">
          <Bell size={40} className="mx-auto text-emerald-600" />
          <h2 className="text-2xl font-black text-slate-900 mt-4">
            No tienes notificaciones
          </h2>
          <p className="text-slate-500 mt-2">
            Aquí aparecerán los cambios importantes de tu proceso.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`bg-white border rounded-[2rem] p-6 shadow-sm ${
                notification.leido
                  ? "border-slate-200 opacity-75"
                  : "border-emerald-200"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <MessageSquare size={22} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-black text-slate-900">
                        {notification.titulo}
                      </h3>

                      <span
                        className={`px-3 py-1 rounded-full border text-xs font-black ${
                          typeStyles[notification.tipo] ||
                          "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        {notification.tipo}
                      </span>
                    </div>

                    <p className="text-slate-600 mt-2">
                      {notification.mensaje}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-4">
                      <Clock size={16} />
                      {formatDateTime(notification.createdAt)}
                    </div>
                  </div>
                </div>

                {!notification.leido ? (
                  <button
                    onClick={() => handleMarkAsRead(notification)}
                    className="inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-2xl font-black"
                  >
                    <CheckCircle2 size={17} />
                    Marcar leída
                  </button>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 bg-slate-50 text-slate-500 border border-slate-200 px-4 py-2 rounded-2xl font-black">
                    <CheckCircle2 size={17} />
                    Leída
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ApplicantNotifications;