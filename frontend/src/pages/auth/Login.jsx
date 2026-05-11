import { Link } from "react-router-dom";

function Login() {
  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-2">Iniciar sesión</h1>

        <p className="text-slate-400 mb-8">
          Accede a tu panel de NovaRecruit.
        </p>

        <form className="space-y-5">
          <div>
            <label className="block text-sm mb-2">Correo</label>
            <input
              type="email"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              placeholder="correo@email.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Contraseña</label>
            <input
              type="password"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              placeholder="********"
            />
          </div>

          <button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold"
          >
            Ingresar
          </button>
        </form>

        <p className="text-sm text-slate-400 mt-6">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-400">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;