function Register() {
  return (
    <section className="px-6 py-12 flex justify-center">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-2">Crear cuenta de postulante</h1>

        <p className="text-slate-400 mb-8">
          Completa tus datos para postular a las vacantes de NovaTech Solutions.
        </p>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Nombres"
          />

          <input
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Apellidos"
          />

          <input
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Correo"
          />

          <input
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Teléfono"
          />

          <input
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            placeholder="LinkedIn"
          />

          <input
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            placeholder="GitHub"
          />

          <input
            className="md:col-span-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            placeholder="URL del CV"
          />

          <textarea
            className="md:col-span-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 min-h-32"
            placeholder="Resumen profesional"
          />

          <button
            type="button"
            className="md:col-span-2 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold"
          >
            Crear cuenta
          </button>
        </form>
      </div>
    </section>
  );
}

export default Register;