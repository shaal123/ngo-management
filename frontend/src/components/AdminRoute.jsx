import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Blocks supervisors from accessing admin-only pages like Donors, Departments, Supervisors
// If a supervisor tries to visit /donors, they get redirected to /dashboard
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
};

export default AdminRoute;
