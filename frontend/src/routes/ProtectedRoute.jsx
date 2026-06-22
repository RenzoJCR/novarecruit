import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";
import { getHomeByRole } from "../utils/roleRedirect.js";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    currentUser.debeCambiarPassword &&
    location.pathname !== "/change-password"
  ) {
    return <Navigate to="/change-password" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(currentUser.rolNombre)
  ) {
    return <Navigate to={getHomeByRole(currentUser.rolNombre)} replace />;
  }

  return children;
}

export default ProtectedRoute;