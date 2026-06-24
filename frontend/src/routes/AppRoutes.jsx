import { Navigate, Route, Routes } from "react-router-dom";

import PublicLayout from "../components/layouts/PublicLayout.jsx";
import DashboardLayout from "../components/layouts/DashboardLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

import Home from "../pages/public/Home.jsx";
import PublicJobs from "../pages/public/PublicJobs.jsx";
import PublicJobDetail from "../pages/public/PublicJobDetail.jsx";

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import VerifyEmail from "../pages/auth/VerifyEmail.jsx";
import ChangePassword from "../pages/auth/ChangePassword.jsx";

import Notifications from "../pages/shared/Notifications.jsx";

import ApplicantJobs from "../pages/applicant/ApplicantJobs.jsx";
import ApplicantJobDetail from "../pages/applicant/ApplicantJobDetail.jsx";
import ApplicantApplications from "../pages/applicant/ApplicantApplications.jsx";
import ApplicantEvaluations from "../pages/applicant/ApplicantEvaluations.jsx";
import ApplicantEvaluationDetail from "../pages/applicant/ApplicantEvaluationDetail.jsx";
import ApplicantProfile from "../pages/applicant/ApplicantProfile.jsx";

import RrhhJobs from "../pages/rrhh/RrhhJobs.jsx";
import RrhhCreateJob from "../pages/rrhh/RrhhCreateJob.jsx";

import TechnicalJobs from "../pages/technical/TechnicalJobs.jsx";
import TechnicalJobDetail from "../pages/technical/TechnicalJobDetail.jsx";
import TechnicalEvaluations from "../pages/technical/TechnicalEvaluations.jsx";
import TechnicalCreateEvaluation from "../pages/technical/TechnicalCreateEvaluation.jsx";

import AdminUsers from "../pages/admin/AdminUsers.jsx";
import AdminCreateUser from "../pages/admin/AdminCreateUser.jsx";
import AdminAreas from "../pages/admin/AdminAreas.jsx";
import AdminSkills from "../pages/admin/AdminSkills.jsx";
import AdminReports from "../pages/admin/AdminReports.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/vacantes" element={<PublicJobs />} />
        <Route path="/vacantes/:id" element={<PublicJobDetail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/notificaciones" element={<Notifications />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["POSTULANTE"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/applicant"
          element={<Navigate to="/applicant/vacantes" replace />}
        />

        <Route
          path="/applicant/dashboard"
          element={<Navigate to="/applicant/vacantes" replace />}
        />

        <Route path="/applicant/vacantes" element={<ApplicantJobs />} />

        <Route
          path="/applicant/vacantes/:id"
          element={<ApplicantJobDetail />}
        />

        <Route
          path="/applicant/postulaciones"
          element={<ApplicantApplications />}
        />

        <Route
          path="/applicant/evaluaciones"
          element={<ApplicantEvaluations />}
        />

        <Route
          path="/applicant/evaluaciones/:id"
          element={<ApplicantEvaluationDetail />}
        />

        <Route
          path="/applicant/notificaciones"
          element={<Navigate to="/notificaciones" replace />}
        />

        <Route path="/applicant/perfil" element={<ApplicantProfile />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["RECURSOS_HUMANOS"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/rrhh"
          element={<Navigate to="/rrhh/vacantes" replace />}
        />

        <Route
          path="/rrhh/dashboard"
          element={<Navigate to="/rrhh/vacantes" replace />}
        />

        <Route path="/rrhh/vacantes" element={<RrhhJobs />} />

        <Route path="/rrhh/vacantes/create" element={<RrhhCreateJob />} />

        {/*
          Rutas antiguas del flujo RRHH.
          Se conservan como redirección para no romper links guardados,
          pero el flujo principal ahora es:
          Vacantes → Ver vacante → Candidatos → Aprobar/Rechazar.
        */}
        <Route
          path="/rrhh/postulaciones"
          element={<Navigate to="/rrhh/vacantes" replace />}
        />

        <Route
          path="/rrhh/candidatos"
          element={<Navigate to="/rrhh/vacantes" replace />}
        />

        <Route
          path="/rrhh/entrevistas"
          element={<Navigate to="/rrhh/vacantes" replace />}
        />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["LIDER_TECNICO"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/technical"
          element={<Navigate to="/technical/vacantes" replace />}
        />

        <Route
          path="/technical/dashboard"
          element={<Navigate to="/technical/vacantes" replace />}
        />

        <Route path="/technical/vacantes" element={<TechnicalJobs />} />

        <Route
          path="/technical/vacantes/:id"
          element={<TechnicalJobDetail />}
        />

        <Route
          path="/technical/evaluaciones"
          element={<TechnicalEvaluations />}
        />

        <Route
          path="/technical/evaluaciones/create"
          element={<TechnicalCreateEvaluation />}
        />

        {/*
          Rutas antiguas del flujo técnico.
          Se conservan como redirección para no romper links guardados,
          pero el flujo principal ahora es:
          Procesos técnicos → Ver vacante → Candidatos → Asignar/Revisar/Ganador.
        */}
        <Route
          path="/technical/postulantes"
          element={<Navigate to="/technical/vacantes" replace />}
        />

        <Route
          path="/technical/resultados"
          element={<Navigate to="/technical/vacantes" replace />}
        />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["ADMINISTRADOR"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/admin"
          element={<Navigate to="/admin/usuarios" replace />}
        />

        <Route
          path="/admin/dashboard"
          element={<Navigate to="/admin/usuarios" replace />}
        />

        <Route path="/admin/usuarios" element={<AdminUsers />} />

        <Route path="/admin/usuarios/create" element={<AdminCreateUser />} />

        <Route path="/admin/areas" element={<AdminAreas />} />

        <Route path="/admin/habilidades" element={<AdminSkills />} />

        <Route path="/admin/reportes" element={<AdminReports />} />

        <Route
          path="/admin/configuracion"
          element={<Navigate to="/admin/reportes" replace />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;