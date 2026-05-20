import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import bnTranslations from './locales/bn.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: enTranslations,
      bn: bnTranslations,
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safe from xss
    },
  });

export default i18n;
