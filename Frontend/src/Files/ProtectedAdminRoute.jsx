import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const { user, authLoading } = useContext(AuthContext);

  // ✅ Wait for auth restore
  if (authLoading) return null;

  // ✅ Not logged in
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ Check roles ARRAY (correct structure)
  if (!user.roles?.includes("admin")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
