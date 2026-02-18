import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Check role permission
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      return <Navigate to="/products" replace />;
    }

    return <Outlet />;

  } catch (error) {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
