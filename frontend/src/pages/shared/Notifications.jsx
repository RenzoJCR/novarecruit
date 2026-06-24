import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  RefreshCw,
} from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { notificacionService } from "../../services/notificacionService.js";
import { useAuth } from "../../context/AuthContext.jsx";

function formatDateTime(value) {
  if (!value) return "Sin fecha";

  return new Date(value).toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function typeClass(type) {
  const styles = {
    SISTEMA: "bg-slate-50 text-slate-700 border-slate-200",
    POSTULACION: "bg-sky-50 text-sky-700 border-sky-200",
    EVALUACION: "bg-violet-50 text-violet-700 border-violet-200",
    RESULTADO: "bg-emerald-50 text-emerald-700 border-emerald-200",
    MENSAJE: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return styles[type] || "bg-slate-50 text-slate-700 border-slate-200";
}

function getRoleLabel(roleName) {
  const labels = {
    ADMINISTRADOR: "Administrador",
    RECURSOS_HUMANOS: "Recursos Humanos",
    LIDER_TECNICO: "Líder Técnico",
    POSTULANTE: "Postulante",
  };

  return labels[roleName] || roleName || "Usuario";
}

function Notifications() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const loadNotifications = useCallback(
    async (showLoading = true) => {
      if (!currentUser?.id) {
        setMessage("No se encontró el usuario autenticado.");
        setLoading(false);
        return;
      }

      try {
        if (showLoading) {
          setLoading(true);
        } else {
          setUpdating(true);
        }

        /*
         * Importante:
         * Esta consulta usa el ID del usuario autenticado.
         * Por eso cada usuario ve solo sus propias notificaciones.
         */
        const data = await notificacionService.getByUsuario(currentUser.id);
        setNotifications(data);
      } catch (error) {
        setMessage(
          error.userMessage || "No se pudieron cargar las notificaciones."
        );
      } finally {
        setLoading(false);
        setUpdating(false);
      }
    },
    [currentUser?.id]
  );

  useEffect(() => {
    loadNotifications(true);
  }, [loadNotifications]);

  /*
   * Esta pantalla escucha el evento interno que lanza DashboardLayout
   * cuando recibe una notificación por WebSocket.
   *
   * Si el usuarioId recibido coincide con el usuario actual,
   * se vuelve a cargar la lista automáticamente.
   */
  useEffect(() => {
    const handleRealtimeNotification = (event) => {
      const notification = event.detail;

      const isForCurrentUser =
        Number(notification?.usuarioId) === Number(currentUser?.id);

      if (isForCurrentUser) {
        loadNotifications(false);
      }
    };

    window.addEventListener(
      "novarecruit:notification-received",
      handleRealtimeNotification
    );

    return () => {
      window.removeEventListener(
        "novarecruit:notification-received",
        handleRealtimeNotification
      );
    };
  }, [currentUser?.id, loadNotifications]);

  const handleMarkAsRead = async (notification) => {
    try {
      await notificacionService.markAsRead(notification.id);
      await loadNotifications(false);
    } catch (error) {
      setMessage(error.userMessage || "No se pudo actualizar la notificación.");
    }
  };

  const handleOpenDestination = async (notification) => {
    if (!notification.leido) {
      await handleMarkAsRead(notification);
    }

    if (notification.urlDestino) {
      navigate(notification.urlDestino);
    }
  };

  const unreadCount = notifications.filter((item) => !item.leido).length;
  const readCount = notifications.filter((item) => item.leido).length;

  return (
    <div>
      <SectionHeader
        title="Notificaciones"
        description={`Avisos personales para ${getRoleLabel(
          currentUser?.rolNombre
        )}. Cada usuario ve solo sus propias notificaciones.`}
        action={
          <button
            onClick={() => loadNotifications(false)}
            className="inline-flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-black"
          >
            <RefreshCw size={17} />
            Actualizar
          </button>
        }
      />

      {message && (
        <div className="mb-5 border border-rose-200 bg-rose-50 text-rose-700 rounded-2xl px-4 py-3 text-sm font-semibold">
          {message}
        </div>
      )}

      {updating && (
        <div className="mb-5 border border-sky-200 bg-sky-50 text-sky-700 rounded-2xl px-4 py-3 text-sm font-semibold">
          Actualizando notificaciones en tiempo real...
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Total</p>
          <p className="text-3xl font-black text-slate-700 mt-1">
            {notifications.length}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Pendientes</p>
          <p className="text-3xl font-black text-sky-600 mt-1">
            {unreadCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4">
          <p className="text-sm text-slate-500 font-semibold">Leídas</p>
          <p className="text-3xl font-black text-emerald-600 mt-1">
            {readCount}
          </p>
        </div>
      </section>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-black text-slate-900">
            Cargando notificaciones...
          </h2>
          <p className="text-slate-500 mt-1">Un momento por favor.</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <Bell size={36} className="mx-auto text-sky-600" />
          <h2 className="text-xl font-black text-slate-900 mt-3">
            No tienes notificaciones
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Aquí aparecerán los avisos importantes del proceso.
          </p>
        </div>
      ) : (
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="hidden lg:grid grid-cols-[1.4fr_0.8fr_0.8fr_210px] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-500 uppercase">
            <span>Mensaje</span>
            <span>Tipo</span>
            <span>Fecha</span>
            <span className="text-right">Acciones</span>
          </div>

          <div className="divide-y divide-slate-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr_0.8fr_210px] gap-4 px-5 py-4 items-center ${
                  notification.leido ? "opacity-75" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      notification.leido
                        ? "bg-slate-50 text-slate-500 border border-slate-200"
                        : "bg-sky-50 text-sky-700 border border-sky-100"
                    }`}
                  >
                    <MessageSquare size={18} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-slate-900">
                        {notification.titulo}
                      </p>

                      {!notification.leido && (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-sky-600 text-white text-[11px] font-black">
                          Nuevo
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      {notification.mensaje}
                    </p>
                  </div>
                </div>

                <div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full border text-xs font-black ${typeClass(
                      notification.tipo
                    )}`}
                  >
                    {notification.tipo}
                  </span>
                </div>

                <div>
                  <p className="inline-flex items-center gap-1 text-sm text-slate-500">
                    <Clock size={14} />
                    {formatDateTime(notification.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap justify-start lg:justify-end gap-2">
                  {notification.urlDestino && (
                    <button
                      onClick={() => handleOpenDestination(notification)}
                      className="inline-flex items-center justify-center gap-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-sm font-bold"
                    >
                      <ExternalLink size={16} />
                      Abrir
                    </button>
                  )}

                  {!notification.leido ? (
                    <button
                      onClick={() => handleMarkAsRead(notification)}
                      className="inline-flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-xl text-sm font-bold"
                    >
                      <CheckCircle2 size={16} />
                      Marcar leída
                    </button>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-1.5 border border-slate-200 bg-slate-50 text-slate-500 px-3 py-2 rounded-xl text-sm font-bold">
                      <CheckCircle2 size={16} />
                      Leída
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Notifications;