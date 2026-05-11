import { Navigate, Route, Routes } from "react-router-dom";

import PublicLayout from "../components/layouts/PublicLayout.jsx";
import DashboardLayout from "../components/layouts/DashboardLayout.jsx";

import Home from "../pages/public/Home.jsx";
import PublicJobs from "../pages/public/PublicJobs.jsx";
import PublicJobDetail from "../pages/public/PublicJobDetail.jsx";

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";

import ApplicantDashboard from "../pages/applicant/ApplicantDashboard.jsx";
import ApplicantJobs from "../pages/applicant/ApplicantJobs.jsx";
import ApplicantJobDetail from "../pages/applicant/ApplicantJobDetail.jsx";
import ApplicantApplications from "../pages/applicant/ApplicantApplications.jsx";
import ApplicantEvaluations from "../pages/applicant/ApplicantEvaluations.jsx";
import ApplicantEvaluationDetail from "../pages/applicant/ApplicantEvaluationDetail.jsx";
import ApplicantNotifications from "../pages/applicant/ApplicantNotifications.jsx";
import ApplicantProfile from "../pages/applicant/ApplicantProfile.jsx";

import RrhhDashboard from "../pages/rrhh/RrhhDashboard.jsx";
import RrhhJobs from "../pages/rrhh/RrhhJobs.jsx";
import RrhhCreateJob from "../pages/rrhh/RrhhCreateJob.jsx";
import RrhhApplications from "../pages/rrhh/RrhhApplications.jsx";
import RrhhCandidates from "../pages/rrhh/RrhhCandidates.jsx";
import RrhhInterviews from "../pages/rrhh/RrhhInterviews.jsx";

import TechnicalDashboard from "../pages/technical/TechnicalDashboard.jsx";
import TechnicalEvaluations from "../pages/technical/TechnicalEvaluations.jsx";
import TechnicalCreateEvaluation from "../pages/technical/TechnicalCreateEvaluation.jsx";
import TechnicalApplicants from "../pages/technical/TechnicalApplicants.jsx";
import TechnicalResults from "../pages/technical/TechnicalResults.jsx";

import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminUsers from "../pages/admin/AdminUsers.jsx";
import AdminCreateUser from "../pages/admin/AdminCreateUser.jsx";
import AdminAreas from "../pages/admin/AdminAreas.jsx";
import AdminReports from "../pages/admin/AdminReports.jsx";
import AdminSettings from "../pages/admin/AdminSettings.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/vacantes" element={<PublicJobs />} />
        <Route path="/vacantes/:id" element={<PublicJobDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route
          path="/applicant"
          element={<Navigate to="/applicant/dashboard" replace />}
        />
        <Route path="/applicant/dashboard" element={<ApplicantDashboard />} />
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
          element={<ApplicantNotifications />}
        />
        <Route path="/applicant/perfil" element={<ApplicantProfile />} />

        <Route
          path="/rrhh"
          element={<Navigate to="/rrhh/dashboard" replace />}
        />
        <Route path="/rrhh/dashboard" element={<RrhhDashboard />} />
        <Route path="/rrhh/vacantes" element={<RrhhJobs />} />
        <Route path="/rrhh/vacantes/create" element={<RrhhCreateJob />} />
        <Route path="/rrhh/postulaciones" element={<RrhhApplications />} />
        <Route path="/rrhh/candidatos" element={<RrhhCandidates />} />
        <Route path="/rrhh/entrevistas" element={<RrhhInterviews />} />

        <Route
          path="/technical"
          element={<Navigate to="/technical/dashboard" replace />}
        />
        <Route path="/technical/dashboard" element={<TechnicalDashboard />} />
        <Route
          path="/technical/evaluaciones"
          element={<TechnicalEvaluations />}
        />
        <Route
          path="/technical/evaluaciones/create"
          element={<TechnicalCreateEvaluation />}
        />
        <Route path="/technical/postulantes" element={<TechnicalApplicants />} />
        <Route path="/technical/resultados" element={<TechnicalResults />} />

        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/usuarios" element={<AdminUsers />} />
        <Route path="/admin/usuarios/create" element={<AdminCreateUser />} />
        <Route path="/admin/areas" element={<AdminAreas />} />
        <Route path="/admin/reportes" element={<AdminReports />} />
        <Route path="/admin/configuracion" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;