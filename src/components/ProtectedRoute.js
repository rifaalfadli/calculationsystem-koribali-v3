// components/ProtectedRoute.js
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("user_session");

  if (!isAuthenticated) {
    // Jika tidak login, arahkan ke login
    return <Navigate to="/entry" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
