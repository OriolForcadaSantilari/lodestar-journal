import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import es from './locales/es.json';
import en from './locales/en.json';

// Idiomas con traducciones reales. Por ahora solo español.
const SUPPORTED = ['es'];
const FALLBACK = 'es';

function detectarIdioma() {
  const codigo = getLocales()?.[0]?.languageCode;
  return SUPPORTED.includes(codigo) ? codigo : FALLBACK;
}

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: detectarIdioma(),
  fallbackLng: FALLBACK,
  // Si una clave está vacía (en.json), usa el idioma de respaldo.
  returnEmptyString: false,
  interpolation: { escapeValue: false },
});

export default i18n;
