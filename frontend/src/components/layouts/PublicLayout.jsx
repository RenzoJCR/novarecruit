import { Link, Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute top-32 right-0 w-[420px] h-[420px] bg-sky-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[360px] h-[360px] bg-teal-300/10 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 h-20 flex items-center justify-between px-8 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <Link to="/" className="text-2xl font-black tracking-tight">
          Nova<span className="gradient-text">Recruit</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-slate-300">
          <Link to="/" className="hover:text-emerald-300 transition-colors">
            Inicio
          </Link>

          <Link
            to="/vacantes"
            className="hover:text-emerald-300 transition-colors"
          >
            Vacantes
          </Link>

          <Link
            to="/login"
            className="hover:text-emerald-300 transition-colors"
          >
            Iniciar sesión
          </Link>

          <Link
            to="/register"
            className="bg-white text-slate-950 hover:bg-emerald-100 px-4 py-2 rounded-xl font-bold transition-colors"
          >
            Crear cuenta
          </Link>
        </nav>
      </header>

      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;