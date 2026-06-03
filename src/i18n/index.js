import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import es from './locales/es.json';
import en from './locales/en.json';

const SUPPORTED = ['es', 'en'];
const FALLBACK = 'en';
const STORAGE_KEY = 'diario:idioma';

// Idioma según el sistema: 'es' si el iPhone está en español, 'en' en cualquier otro caso.
export function idiomaAuto() {
  const codigo = getLocales()?.[0]?.languageCode;
  return codigo === 'es' ? 'es' : 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: idiomaAuto(),
  fallbackLng: FALLBACK,
  returnEmptyString: false,
  interpolation: { escapeValue: false },
});

// Devuelve la preferencia guardada por el usuario: 'auto' | 'es' | 'en'.
export async function obtenerPreferenciaIdioma() {
  try {
    const v = await AsyncStorage.getItem(STORAGE_KEY);
    return v === 'es' || v === 'en' || v === 'auto' ? v : 'auto';
  } catch (e) {
    console.warn('No se pudo leer la preferencia de idioma:', e);
    return 'auto';
  }
}

// Aplica la preferencia (cambia el idioma activo si hace falta).
export async function aplicarPreferenciaIdioma(pref) {
  const objetivo = pref === 'auto' ? idiomaAuto() : pref;
  if (i18n.language !== objetivo) {
    await i18n.changeLanguage(objetivo);
  }
}

// Guarda la preferencia en AsyncStorage y la aplica.
export async function guardarPreferenciaIdioma(pref) {
  await AsyncStorage.setItem(STORAGE_KEY, pref);
  await aplicarPreferenciaIdioma(pref);
}

// Llamada al arrancar la app para respetar la preferencia guardada.
export async function inicializarIdiomaDesdeStorage() {
  const pref = await obtenerPreferenciaIdioma();
  await aplicarPreferenciaIdioma(pref);
}

export default i18n;
