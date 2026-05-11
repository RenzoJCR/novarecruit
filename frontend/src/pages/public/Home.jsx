import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="px-8 py-24 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <span className="inline-block mb-5 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm">
            Reclutamiento tecnológico para NovaTech Solutions
          </span>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
            Encuentra tu lugar en el equipo que construye el futuro digital.
          </h1>

          <p className="text-slate-300 mt-6 text-lg">
            Postula a vacantes de desarrollo web, apps móviles, software
            empresarial, cloud, QA y DevOps.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/vacantes"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
            >
              Ver vacantes
            </Link>

            <Link
              to="/register"
              className="border border-slate-700 hover:bg-slate-900 px-6 py-3 rounded-xl font-semibold"
            >
              Crear cuenta
            </Link>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Proceso de selección</h2>

          <div className="space-y-4">
            {[
              "Registro de perfil",
              "Postulación a vacante",
              "Revisión de RRHH",
              "Evaluación técnica",
              "Resultado final",
            ].map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800"
              >
                <span className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;