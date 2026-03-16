import { Navigate } from 'react-router-dom';
import authService from '../services/auth.service';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = authService.getCurrentUser();

  if (!user || (!user.token && !user._id)) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
