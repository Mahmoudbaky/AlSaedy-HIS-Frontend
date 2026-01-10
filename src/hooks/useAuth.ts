import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authService, type LoginCredentials, type RegisterData } from 'src/services/auth.service';

// Login mutation
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      navigate('/'); // Redirect to dashboard after successful login
    },
  });
};

// Register mutation
export const useRegister = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      // After registration, user needs admin confirmation before they can log in
      // So we might want to show a message instead of redirecting
      navigate('/auth/auth2/login', { 
        state: { 
          message: 'Registration successful! Please wait for admin confirmation before logging in.' 
        } 
      });
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
      navigate('/auth/auth2/login');
    },
  });
};
