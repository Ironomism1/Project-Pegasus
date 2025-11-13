import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// --- NEW: Import translation files directly ---
import enTranslations from './locales/en/translation.json';
import hiTranslations from './locales/hi/translation.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // --- NEW: Use a 'resources' object instead of the backend loader ---
    resources: {
      en: {
        translation: enTranslations,
      },
      hi: {
        translation: hiTranslations,
      },
    },
    lng: 'en', // Set the initial language
    fallbackLng: 'en', // Use English if a translation is missing
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  }, (err, t) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error('i18n init error:', err);
    } else {
      // eslint-disable-next-line no-console
      console.log('i18n initialized. Current language:', i18n.language);
      // eslint-disable-next-line no-console
      console.log('i18n resources:', Object.keys(i18n.options.resources || {}));
    }
  });

export default i18n;