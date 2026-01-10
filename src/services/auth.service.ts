import apiClient from 'src/lib/apiClient';
import { API_ENDPOINTS } from 'src/config/api';
import axios from 'axios';
import { API_BASE_URL } from 'src/config/api';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  branch: string;
  role?: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  branch: string;
  role: string | null;
  confirmed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
  requestId?: string;
}

export interface LoginResponse {
  user: User;
  tokens: Tokens;
}

export interface RegisterResponse {
  user: User;
  tokens: Tokens;
}

// Auth Service
class AuthService {
  // Get access token from localStorage
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Get refresh token from localStorage
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Store tokens
  setTokens(tokens: Tokens): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  // Clear tokens
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Store user data
  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Get user data
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Use axios without interceptors for login (no token needed)
      const response = await axios.post<ApiResponse<LoginResponse>>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
        credentials,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const result = response.data;

      if (result.success && result.data) {
        this.setTokens(result.data.tokens);
        this.setUser(result.data.user);
        return result.data;
      }

      throw new Error(result.message || 'Login failed');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const result = error.response.data as ApiResponse<LoginResponse>;
        throw new Error(result.message || 'Login failed');
      }
      throw error instanceof Error ? error : new Error('Login failed');
    }
  }

  // Register
  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      // Use axios without interceptors for register (no token needed)
      const response = await axios.post<ApiResponse<RegisterResponse>>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
        data,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const result = response.data;

      if (result.success && result.data) {
        this.setTokens(result.data.tokens);
        this.setUser(result.data.user);
        return result.data;
      }

      throw new Error(result.message || 'Registration failed');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const result = error.response.data as ApiResponse<RegisterResponse>;
        throw new Error(result.message || 'Registration failed');
      }
      throw error instanceof Error ? error : new Error('Registration failed');
    }
  }

  // Refresh token
  async refreshTokens(): Promise<Tokens> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      // Use axios without interceptors for refresh (avoid infinite loop)
      const response = await axios.post<ApiResponse<Tokens>>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        { refreshToken },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const result = response.data;

      if (result.success && result.data) {
        this.setTokens(result.data);
        return result.data;
      }

      this.clearTokens();
      throw new Error(result.message || 'Token refresh failed');
    } catch (error) {
      this.clearTokens();
      if (axios.isAxiosError(error) && error.response?.data) {
        const result = error.response.data as ApiResponse<Tokens>;
        throw new Error(result.message || 'Token refresh failed');
      }
      throw error instanceof Error ? error : new Error('Token refresh failed');
    }
  }

  // Logout
  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();

    if (refreshToken) {
      try {
        // Use apiClient (with interceptors) for authenticated requests
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    this.clearTokens();
  }

  // Logout from all devices
  async logoutAll(): Promise<void> {
    try {
      // Use apiClient (with interceptors) for authenticated requests
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT_ALL);
    } catch (error) {
      console.error('Logout all error:', error);
    }

    this.clearTokens();
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      // Use apiClient (with interceptors) for authenticated requests
      const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME);
      const result = response.data;

      if (result.success && result.data) {
        this.setUser(result.data);
        return result.data;
      }

      throw new Error(result.message || 'Failed to get user');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const result = error.response.data as ApiResponse<User>;
        throw new Error(result.message || 'Failed to get user');
      }
      throw error instanceof Error ? error : new Error('Failed to get user');
    }
  }

  // Change password
  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ): Promise<void> {
    try {
      // Use apiClient (with interceptors) for authenticated requests
      const response = await apiClient.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || 'Password change failed');
      }

      // Password changed - tokens are revoked, user must login again
      this.clearTokens();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const result = error.response.data as ApiResponse<null>;
        throw new Error(result.message || 'Password change failed');
      }
      throw error instanceof Error ? error : new Error('Password change failed');
    }
  }

  // Admin: Confirm account
  async confirmAccount(userId: string): Promise<void> {
    try {
      // Use apiClient (with interceptors) for authenticated requests
      const response = await apiClient.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.CONFIRM_ACCOUNT, {
        userId,
      });

      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || 'Account confirmation failed');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const result = error.response.data as ApiResponse<null>;
        throw new Error(result.message || 'Account confirmation failed');
      }
      throw error instanceof Error ? error : new Error('Account confirmation failed');
    }
  }

  // Admin: Change user role
  async changeUserRole(userId: string, role: string): Promise<void> {
    try {
      // Use apiClient (with interceptors) for authenticated requests
      const response = await apiClient.post<ApiResponse<null>>(
        API_ENDPOINTS.AUTH.CHANGE_USER_ROLE,
        { userId, role },
      );

      const result = response.data;

      if (!result.success) {
        throw new Error(result.message || 'Role change failed');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const result = error.response.data as ApiResponse<null>;
        throw new Error(result.message || 'Role change failed');
      }
      throw error instanceof Error ? error : new Error('Role change failed');
    }
  }
}

export const authService = new AuthService();
