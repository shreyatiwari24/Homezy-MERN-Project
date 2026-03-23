import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {

  const { user, authLoading } = useContext(AuthContext);

  // Wait until auth is restored
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Checking authentication...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role restriction
  if (role && !user.roles?.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;


