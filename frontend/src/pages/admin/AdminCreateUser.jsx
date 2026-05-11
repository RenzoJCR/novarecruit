import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SectionHeader from "../../components/ui/SectionHeader.jsx";
import { useData } from "../../context/DataContext.jsx";

const initialForm = {
  name: "",
  email: "",
  role: "RECURSOS_HUMANOS",
  password: "",
  confirmPassword: "",
};

function AdminCreateUser() {
  const navigate = useNavigate();
  const { createSystemUser } = useData();

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setMessage("Completa todos los campos obligatorios.");
      setMessageType("error");
      return;
    }

    if (form.password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      setMessageType("error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      setMessageType("error");
      return;
    }

    createSystemUser({
      name: form.name,
      email: form.email,
      role: form.role,
      temporaryPassword: form.password,
      mustChangePassword: true,
    });

    setMessage("Usuario creado correctamente con contraseña temporal.");
    setMessageType("success");

    setTimeout(() => {
      navigate("/admin/usuarios");
    }, 900);
  };

  const alertStyles = {
    info: "bg-blue-50 border-blue-200 text-blue-700",
    success: "bg-green-50 border-green-200 text-green-700",
    error: "bg-red-50 border-red-200 text-red-700",
  };

  return (
    <div>
      <SectionHeader
        title="Crear usuario"
        description="Registra usuarios internos con rol de RRHH, líder técnico o administrador."
      />

      {message && (
        <div
          className={`mb-5 border rounded-2xl px-5 py-4 font-medium ${alertStyles[messageType]}`}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nombre completo
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Ana Gutiérrez"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Correo institucional
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@novatech.com"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Rol
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="ADMINISTRADOR">Administrador</option>
              <option value="RECURSOS_HUMANOS">Recursos Humanos</option>
              <option value="LIDER_TECNICO">Líder Técnico</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Estado inicial
            </label>
            <input
              value="Activo"
              disabled
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none bg-slate-100 text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Contraseña temporal
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repite la contraseña"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <h3 className="font-bold text-slate-900">
            Nota de seguridad
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            En esta versión frontend se simula la creación de credenciales. En
            la implementación real, Spring Boot deberá cifrar la contraseña
            antes de guardarla en MySQL.
          </p>
        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Crear usuario
        </button>
      </form>
    </div>
  );
}

export default AdminCreateUser;