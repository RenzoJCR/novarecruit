import { Code2, Link, Mail, Phone, FileText } from "lucide-react";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function ApplicantProfile() {
  const { currentUser } = useAuth();

  const initials =
    currentUser?.name
      ?.split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "US";

  return (
    <div>
      <SectionHeader
        title="Mi perfil"
        description="Información personal y profesional usada en tus postulaciones."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="w-24 h-24 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
            {initials}
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-5">
            {currentUser?.name || "Usuario postulante"}
          </h2>

          <p className="text-slate-500">
            {currentUser?.roleLabel || "Postulante"}
          </p>

          <div className="mt-6 space-y-3 text-slate-600">
            <p className="flex items-center gap-3">
              <Mail size={18} className="text-blue-600" />
              {currentUser?.email || "correo@email.com"}
            </p>

            <p className="flex items-center gap-3">
              <Phone size={18} className="text-blue-600" />
              {currentUser?.phone || "+51 987 654 321"}
            </p>

            <p className="flex items-center gap-3">
              <Link size={18} className="text-blue-600" />
              {currentUser?.linkedin || "linkedin.com/in/carlosmendoza"}
            </p>

            <p className="flex items-center gap-3">
              <Code2 size={18} className="text-blue-600" />
              {currentUser?.github || "github.com/carlosmendoza"}
            </p>
          </div>
        </section>

        <section className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">
            Resumen profesional
          </h3>

          <p className="text-slate-600 mt-3 leading-relaxed">
            {currentUser?.summary ||
              "Desarrollador frontend junior con conocimientos en React, JavaScript, TailwindCSS y consumo de APIs REST. Interesado en participar en proyectos tecnológicos orientados a soluciones web empresariales."}
          </p>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-slate-900">Experiencia</h3>

            <p className="text-slate-600 mt-3 leading-relaxed">
              Experiencia académica y práctica en desarrollo de interfaces,
              maquetación responsive, trabajo con componentes reutilizables y
              manejo básico de control de versiones con Git.
            </p>
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={26} />

              <div>
                <h4 className="font-bold text-slate-900">CV del postulante</h4>
                <p className="text-sm text-slate-500">
                  URL registrada para revisión de RRHH.
                </p>
              </div>
            </div>

            <a
              href={currentUser?.cvUrl || "https://drive.google.com/cv-carlos"}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold text-center"
            >
              Ver CV
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ApplicantProfile;