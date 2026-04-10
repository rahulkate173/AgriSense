import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';

// Persist language across sessions
const savedLang = localStorage.getItem('lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      mr: { translation: mr },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
