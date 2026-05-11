import { useState } from "react";
import { Save } from "lucide-react";

import SectionHeader from "../../components/ui/SectionHeader.jsx";

function AdminSettings() {
  const [settings, setSettings] = useState({
    allowPublicJobs: true,
    allowApplicantRegister: true,
    notifyByEmail: false,
    evaluationScoreVisible: false,
  });

  const [message, setMessage] = useState("");

  const toggleSetting = (key) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: !prevSettings[key],
    }));
  };

  const handleSave = () => {
    setMessage("Configuración guardada correctamente.");
  };

  return (
    <div>
      <SectionHeader
        title="Configuración del sistema"
        description="Parámetros generales simulados de NovaRecruit."
      />

      {message && (
        <div className="mb-5 bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl px-5 py-4 font-medium">
          {message}
        </div>
      )}

      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-4xl">
        <h2 className="text-xl font-bold text-slate-900 mb-5">
          Preferencias generales
        </h2>

        <div className="space-y-5">
          <label className="flex items-center justify-between gap-4 border border-slate-200 rounded-2xl p-4">
            <div>
              <p className="font-bold text-slate-900">
                Mostrar vacantes públicas
              </p>
              <p className="text-sm text-slate-500">
                Permite visualizar vacantes sin iniciar sesión.
              </p>
            </div>

            <input
              type="checkbox"
              checked={settings.allowPublicJobs}
              onChange={() => toggleSetting("allowPublicJobs")}
            />
          </label>

          <label className="flex items-center justify-between gap-4 border border-slate-200 rounded-2xl p-4">
            <div>
              <p className="font-bold text-slate-900">
                Permitir registro de postulantes
              </p>
              <p className="text-sm text-slate-500">
                Habilita el formulario público de creación de cuenta.
              </p>
            </div>

            <input
              type="checkbox"
              checked={settings.allowApplicantRegister}
              onChange={() => toggleSetting("allowApplicantRegister")}
            />
          </label>

          <label className="flex items-center justify-between gap-4 border border-slate-200 rounded-2xl p-4">
            <div>
              <p className="font-bold text-slate-900">
                Notificaciones por correo
              </p>
              <p className="text-sm text-slate-500">
                Simula el envío de notificaciones por correo electrónico.
              </p>
            </div>

            <input
              type="checkbox"
              checked={settings.notifyByEmail}
              onChange={() => toggleSetting("notifyByEmail")}
            />
          </label>

          <label className="flex items-center justify-between gap-4 border border-slate-200 rounded-2xl p-4">
            <div>
              <p className="font-bold text-slate-900">
                Mostrar puntaje al postulante
              </p>
              <p className="text-sm text-slate-500">
                Se mantiene desactivado porque el postulante no debe ver su nota interna.
              </p>
            </div>

            <input
              type="checkbox"
              checked={settings.evaluationScoreVisible}
              onChange={() => toggleSetting("evaluationScoreVisible")}
            />
          </label>
        </div>

        <button
          onClick={handleSave}
          className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          <Save size={18} />
          Guardar configuración
        </button>
      </section>
    </div>
  );
}

export default AdminSettings;