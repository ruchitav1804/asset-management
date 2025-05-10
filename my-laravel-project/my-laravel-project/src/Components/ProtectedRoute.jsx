import { Navigate } from 'react-router-dom';
import { useStateContext } from "../contexts/contextprovider";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useStateContext();

  if (loading) {
    // ✅ Show loading until context is initialized
    return <div>Loading...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
