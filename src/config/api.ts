// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    LOGOUT_ALL: '/auth/logout-all',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    CONFIRM_ACCOUNT: '/auth/confirm-account',
    CHANGE_USER_ROLE: '/auth/change-user-role',
  },
} as const;
