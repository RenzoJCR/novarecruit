export function getHomeByRole(roleName) {
  const routes = {
    ADMINISTRADOR: "/admin",
    RECURSOS_HUMANOS: "/rrhh/vacantes",
    LIDER_TECNICO: "/technical/evaluaciones",
    POSTULANTE: "/applicant/vacantes",
  };

  return routes[roleName] || "/";
}