import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import kn  from './locales/kn.json';

i18n
  .use(initReactI18next) // Connects i18next to React
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      kn: { translation: kn }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes by default
    }
    
  });

export default i18n;
