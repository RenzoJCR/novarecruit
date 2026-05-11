import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Bell,
  User,
  Users,
  ClipboardList,
  Calendar,
  Settings,
  Building2,
  BarChart3,
  GraduationCap,
  UserCheck,
} from "lucide-react";

export const navigationByRole = {
  postulante: [
    {
      label: "Dashboard",
      path: "/applicant/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Vacantes",
      path: "/applicant/vacantes",
      icon: Briefcase,
    },
    {
      label: "Mis postulaciones",
      path: "/applicant/postulaciones",
      icon: FileText,
    },
    {
      label: "Evaluaciones",
      path: "/applicant/evaluaciones",
      icon: ClipboardList,
    },
    {
      label: "Notificaciones",
      path: "/applicant/notificaciones",
      icon: Bell,
    },
    {
      label: "Mi perfil",
      path: "/applicant/perfil",
      icon: User,
    },
  ],

  rrhh: [
    {
      label: "Dashboard",
      path: "/rrhh/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Vacantes",
      path: "/rrhh/vacantes",
      icon: Briefcase,
    },
    {
      label: "Crear vacante",
      path: "/rrhh/vacantes/create",
      icon: FileText,
    },
    {
      label: "Postulaciones",
      path: "/rrhh/postulaciones",
      icon: Users,
    },
    {
      label: "Candidatos",
      path: "/rrhh/candidatos",
      icon: UserCheck,
    },
    {
      label: "Entrevistas",
      path: "/rrhh/entrevistas",
      icon: Calendar,
    },
  ],

  tecnico: [
    {
      label: "Dashboard",
      path: "/technical/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Evaluaciones",
      path: "/technical/evaluaciones",
      icon: ClipboardList,
    },
    {
      label: "Crear evaluación",
      path: "/technical/evaluaciones/create",
      icon: GraduationCap,
    },
    {
      label: "Postulantes",
      path: "/technical/postulantes",
      icon: Users,
    },
    {
      label: "Resultados",
      path: "/technical/resultados",
      icon: BarChart3,
    },
  ],

  administrador: [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Usuarios",
      path: "/admin/usuarios",
      icon: Users,
    },
    {
      label: "Crear usuario",
      path: "/admin/usuarios/create",
      icon: UserCheck,
    },
    {
      label: "Áreas",
      path: "/admin/areas",
      icon: Building2,
    },
    {
      label: "Reportes",
      path: "/admin/reportes",
      icon: BarChart3,
    },
    {
      label: "Configuración",
      path: "/admin/configuracion",
      icon: Settings,
    },
  ],
};