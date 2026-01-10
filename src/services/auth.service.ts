import { API_BASE_URL, API_ENDPOINTS } from 'src/config/api';

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
  private baseURL = API_BASE_URL;

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
    const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const result: ApiResponse<LoginResponse> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }

    if (result.data) {
      this.setTokens(result.data.tokens);
      this.setUser(result.data.user);
    }

    return result.data!;
  }

  // Register
  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH.REGISTER}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<RegisterResponse> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    if (result.data) {
      this.setTokens(result.data.tokens);
      this.setUser(result.data.user);
    }

    return result.data!;
  }

  // Refresh token
  async refreshTokens(): Promise<Tokens> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH.REFRESH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const result: ApiResponse<Tokens> = await response.json();

    if (!response.ok) {
      this.clearTokens();
      throw new Error(result.message || 'Token refresh failed');
    }

    if (result.data) {
      this.setTokens(result.data);
    }

    return result.data!;
  }

  // Logout
  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getAccessToken();

    if (refreshToken && accessToken) {
      try {
        await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    this.clearTokens();
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH.ME}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const result: ApiResponse<User> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to get user');
    }

    if (result.data) {
      this.setUser(result.data);
    }

    return result.data!;
  }
}

export const authService = new AuthService();
