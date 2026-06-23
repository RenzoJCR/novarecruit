export function getHomeByRole(roleName) {
  const routes = {
    ADMINISTRADOR: "/admin/usuarios",
    RECURSOS_HUMANOS: "/rrhh/vacantes",
    LIDER_TECNICO: "/technical/vacantes",
    POSTULANTE: "/applicant/vacantes",
  };

  return routes[roleName] || "/";
}