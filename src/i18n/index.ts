import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

export const LANGUAGES = {
  en: { code: 'en', label: 'English', dir: 'ltr' },
  ar: { code: 'ar', label: 'العربية', dir: 'rtl' },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

const STORAGE_KEY = 'app-language';

export const getStoredLanguage = (): LanguageCode => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'ar') return stored;
  return 'en';
};

export const setStoredLanguage = (code: LanguageCode): void => {
  localStorage.setItem(STORAGE_KEY, code);
};

export const applyLanguageDirection = (code: LanguageCode): void => {
  const dir = LANGUAGES[code].dir;
  document.documentElement.lang = code;
  document.documentElement.dir = dir;
  document.body.setAttribute('dir', dir);
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: getStoredLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

applyLanguageDirection(getStoredLanguage());

i18n.on('languageChanged', (lng) => {
  const code = lng as LanguageCode;
  if (LANGUAGES[code]) applyLanguageDirection(code);
});

export default i18n;
