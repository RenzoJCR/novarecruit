export function getHomeByRole(roleName) {
  const routes = {
    ADMINISTRADOR: "/admin/dashboard",
    RECURSOS_HUMANOS: "/rrhh/vacantes",
    LIDER_TECNICO: "/technical/vacantes",
    POSTULANTE: "/applicant/vacantes",
  };

  return routes[roleName] || "/";
}