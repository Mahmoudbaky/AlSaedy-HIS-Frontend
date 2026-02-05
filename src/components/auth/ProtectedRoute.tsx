import { Navigate, Outlet } from 'react-router';
import { authService } from 'src/services/auth.service';

/**
 * ProtectedRoute component that wraps routes requiring authentication.
 * Redirects to login page if user is not authenticated.
 */
const ProtectedRoute = () => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/auth/auth2/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
