import { Navigate, Outlet } from 'react-router';
import { useEffect, useState } from 'react';
import { authService } from 'src/services/auth.service';

/**
 * ProtectedRoute component that wraps routes requiring authentication.
 * Redirects to login page if user is not authenticated.
 */
const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());

  useEffect(() => {
    // Check authentication status on mount and when storage changes
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    // Check immediately
    checkAuth();

    // Listen for storage events (when localStorage changes in other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'refreshToken') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (for same-tab changes)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('auth-state-changed', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-state-changed', handleAuthChange);
    };
  }, []);

  console.log(isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth/auth2/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
