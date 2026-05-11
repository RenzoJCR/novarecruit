import { Link, Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="h-20 flex items-center justify-between px-8 border-b border-slate-800">
        <Link to="/" className="text-2xl font-bold">
          Nova<span className="text-blue-500">Recruit</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-blue-400">
            Inicio
          </Link>
          <Link to="/vacantes" className="hover:text-blue-400">
            Vacantes
          </Link>
          <Link to="/login" className="hover:text-blue-400">
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl"
          >
            Crear cuenta
          </Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;