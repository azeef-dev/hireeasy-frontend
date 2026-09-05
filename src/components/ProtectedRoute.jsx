import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ roles, redirectTo = '/login', children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to={redirectTo} replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}