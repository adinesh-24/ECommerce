import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// ── Helper: read + decode token, also checks expiry ──────────
const getUser = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = jwtDecode(token);

    // Check if token has expired (exp is in seconds)
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }

    return decoded;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};

// ── ProtectedRoute: requires login (+ optional role check) ───
const ProtectedRoute = ({ allowedRoles }) => {
  const user = getUser();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

// ── GuestRoute: redirects logged-in users away from /login etc.
export const GuestRoute = () => {
  const user = getUser();
  // If already logged in → go to home (or /admin for admin)
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
  return <Outlet />;
};

export default ProtectedRoute;
