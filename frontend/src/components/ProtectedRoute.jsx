import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirects unauthenticated users and wrong-role users
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuth } = useAuth();

  if (!isAuth) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to correct dashboard instead of 403
    const roleRoutes = { user: '/dashboard', manager: '/manager', driver: '/driver', admin: '/admin' };
    return <Navigate to={roleRoutes[user?.role] || '/login'} replace />;
  }
  return children;
}
