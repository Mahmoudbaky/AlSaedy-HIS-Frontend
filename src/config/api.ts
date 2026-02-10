// API_BASE_URL is set from C:\settings\AlSaedy-HIS-settings.txt at runtime (ip=... line) via /api/settings, or from env
function setApiBaseUrlFromNetwork(network: string | undefined) {
  console.log(network);
  switch (network) {
    case '200':
      API_BASE_URL = import.meta.env.VITE_API_BASE_URL_200 ?? '';
      break;
    case '100':
      API_BASE_URL = import.meta.env.VITE_API_BASE_URL_100 ?? '';
      break;
    case '120':
      API_BASE_URL = import.meta.env.VITE_API_BASE_URL_120 ?? '';
      break;
    case '130':
      API_BASE_URL = import.meta.env.VITE_API_BASE_URL_130 ?? '';
      break;
    default:
      API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
      break;
  }
}

export let API_BASE_URL: string;

// Initial value from env
setApiBaseUrlFromNetwork(import.meta.env.VITE_NETWORK as string | undefined);

/** Fetches settings from dev server (reads C:\\settings\\AlSaedy-HIS-settings.txt) and updates API_BASE_URL. Call before app render. */
export async function ensureApiConfig(): Promise<void> {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) return;
    const { network } = (await res.json()) as { network: string | null };
    if (network != null) setApiBaseUrlFromNetwork(network);
  } catch {
    // No dev server or network error: keep env-based API_BASE_URL
  }
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    LOGOUT_ALL: '/auth/logout-all',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    GET_USERS_FOR_ADMIN: '/auth/get-users-for-admin',
    CONFIRM_ACCOUNT: '/auth/confirm-account',
    CHANGE_USER_ROLE: '/auth/change-user-role',
  },
  STATISTICS: {
    HOLY_CAPITAL_HOSPITALS: '/statistics/holy-capital-hospitals',
    DOCTORS: '/statistics/doctors',
    DENTAL_DOCTORS: '/statistics/dental-doctors',
  },
} as const;
