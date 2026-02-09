import { useQuery } from '@tanstack/react-query';
import { authService, type User } from 'src/services/auth.service';

const AUTH_USER_QUERY_KEY = ['auth', 'user'] as const;

/**
 * Hook that returns the currently logged-in user info.
 * Fetches from API when authenticated; stays in sync with login/logout (same query key as useAuth).
 */
export const useUser = () => {
  const isAuthenticated = authService.isAuthenticated();

  const query = useQuery({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: () => authService.getCurrentUser(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (): User | undefined => {
      if (!isAuthenticated) return undefined;
      return authService.getUser() ?? undefined;
    },
  });

  return {
    user: query.data ?? undefined,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isAuthenticated,
  };
};
