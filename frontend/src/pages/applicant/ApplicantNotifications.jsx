import { Bell, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { useData } from "../../context/DataContext.jsx";

const notificationIcons = {
  info: Bell,
  success: CheckCircle2,
  warning: AlertCircle,
};

const notificationStyles = {
  info: "bg-blue-50 text-blue-600",
  success: "bg-green-50 text-green-600",
  warning: "bg-yellow-50 text-yellow-600",
};

function ApplicantNotifications() {
  const { notifications, markNotificationAsRead } = useData();

  return (
    <div>
      <SectionHeader
        title="Notificaciones"
        description="Revisa los avisos importantes sobre tus postulaciones y evaluaciones."
      />

      <div className="space-y-4">
        {notifications.map((notification) => {
          const Icon = notificationIcons[notification.type] || Bell;
          const style =
            notificationStyles[notification.type] ||
            "bg-slate-100 text-slate-600";

          return (
            <article
              key={notification.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4 shadow-sm"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${style}`}
              >
                <Icon size={22} />
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h3 className="font-bold text-slate-900">
                    {notification.title}
                  </h3>

                  <span className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={15} />
                    {notification.date}
                  </span>
                </div>

                <p className="text-slate-600 mt-2">
                  {notification.message}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  {!notification.read && (
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      Nuevo
                    </span>
                  )}

                  {!notification.read && (
                    <button
                      onClick={() => markNotificationAsRead(notification.id)}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Marcar como leída
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default ApplicantNotifications;