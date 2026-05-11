import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  UserRound,
  Code2,
  ArrowRight,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";

const roleOptions = [
  {
    id: "postulante",
    title: "Postulante",
    description: "Ver vacantes, postular y rendir evaluaciones.",
    icon: UserRound,
    redirectTo: "/applicant/dashboard",
  },
  {
    id: "rrhh",
    title: "RRHH",
    description: "Crear vacantes y revisar candidatos.",
    icon: Users,
    redirectTo: "/rrhh/dashboard",
  },
  {
    id: "tecnico",
    title: "Líder Técnico",
    description: "Asignar evaluaciones y revisar resultados.",
    icon: Code2,
    redirectTo: "/technical/dashboard",
  },
  {
    id: "administrador",
    title: "Administrador",
    description: "Gestionar usuarios, áreas y reportes.",
    icon: ShieldCheck,
    redirectTo: "/admin/dashboard",
  },
];

function Login() {
  const navigate = useNavigate();
  const { loginAs } = useAuth();

  const [selectedRole, setSelectedRole] = useState("postulante");
  const [email, setEmail] = useState("demo@novarecruit.com");
  const [password, setPassword] = useState("123456");
  const [message, setMessage] = useState("");

  const selectedOption = roleOptions.find((role) => role.id === selectedRole);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Ingresa correo y contraseña.");
      return;
    }

    const result = loginAs(selectedRole);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    navigate(selectedOption.redirectTo);
  };

  return (
    <section className="min-h-[calc(100vh-80px)] px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8">
        <div className="glass-card rounded-[2rem] p-8 shadow-2xl">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-300/20 text-emerald-300 text-sm font-semibold mb-6">
            <LockKeyhole size={16} />
            Acceso simulado para demostración
          </span>

          <h1 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight">
            Ingresa a <span className="gradient-text">NovaRecruit</span>
          </h1>

          <p className="text-slate-400 mb-8 leading-relaxed">
            Selecciona un rol para acceder al panel correspondiente. En la
            versión final, Spring Boot validará el usuario, contraseña y token
            JWT.
          </p>

          {message && (
            <div className="mb-5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl px-5 py-4 font-semibold">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-2 text-slate-300 font-semibold">
                Correo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark"
                placeholder="correo@email.com"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-300 font-semibold">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-dark"
                placeholder="********"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-slate-300 font-semibold">
                Ingresar como
              </label>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="input-dark"
              >
                {roleOptions.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20 transition-all"
            >
              Ingresar al sistema
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-sm text-slate-400 mt-6">
            ¿Eres postulante nuevo?{" "}
            <Link to="/register" className="text-emerald-300 font-bold">
              Crea tu cuenta aquí
            </Link>
          </p>
        </div>

        <div>
          <div className="mb-5">
            <span className="inline-flex items-center gap-2 text-emerald-300 text-sm font-bold mb-3">
              <Sparkles size={16} />
              Selección rápida de rol
            </span>

            <h2 className="text-3xl font-black">
              Explora el sistema desde cada perfil
            </h2>

            <p className="text-slate-400 mt-2">
              Cada rol tiene navegación, permisos visuales y módulos
              específicos dentro de NovaRecruit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {roleOptions.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;

              return (
                <button
                  type="button"
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`text-left rounded-[1.7rem] p-6 border transition-all ${
                    isSelected
                      ? "bg-gradient-to-br from-emerald-500 to-sky-500 border-white/20 shadow-2xl shadow-emerald-500/20 scale-[1.02]"
                      : "glass-card hover:border-emerald-300/30 hover:-translate-y-1"
                  }`}
                >
                  <div
                    className={`w-13 h-13 rounded-2xl flex items-center justify-center mb-5 ${
                      isSelected
                        ? "bg-white text-emerald-600"
                        : "bg-slate-950/70 text-emerald-300 border border-white/10"
                    }`}
                  >
                    <Icon size={25} />
                  </div>

                  <h3 className="text-xl font-black">{role.title}</h3>

                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      isSelected ? "text-emerald-50" : "text-slate-400"
                    }`}
                  >
                    {role.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;