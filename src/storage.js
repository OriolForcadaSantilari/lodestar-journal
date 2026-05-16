import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIJO = 'diario:entrada:';
const CLAVE_AJUSTES = 'diario:ajustes';

const AJUSTES_POR_DEFECTO = {
  recordatorioActivo: false,
  hora: 21,
  minuto: 0,
};

// Guarda (o sobrescribe) la entrada de un día.
export async function guardarEntrada({ clave, fecha, pregunta, respuesta }) {
  const entrada = { clave, fecha, pregunta, respuesta };
  await AsyncStorage.setItem(PREFIJO + clave, JSON.stringify(entrada));
}

// Devuelve la entrada de un día concreto, o null si no existe.
export async function obtenerEntrada(clave) {
  const crudo = await AsyncStorage.getItem(PREFIJO + clave);
  return crudo ? JSON.parse(crudo) : null;
}

// Devuelve todas las entradas ordenadas de más reciente a más antigua.
export async function obtenerTodasLasEntradas() {
  const claves = await AsyncStorage.getAllKeys();
  const clavesDiario = claves.filter((k) => k.startsWith(PREFIJO));
  if (clavesDiario.length === 0) return [];
  const pares = await AsyncStorage.multiGet(clavesDiario);
  return pares
    .map(([, valor]) => JSON.parse(valor))
    .filter(Boolean)
    .sort((a, b) => (a.clave < b.clave ? 1 : -1));
}

export async function borrarEntrada(clave) {
  await AsyncStorage.removeItem(PREFIJO + clave);
}

// --- Ajustes (recordatorio diario) ---

// Devuelve los ajustes guardados, completados con los valores por defecto.
export async function obtenerAjustes() {
  try {
    const crudo = await AsyncStorage.getItem(CLAVE_AJUSTES);
    return crudo
      ? { ...AJUSTES_POR_DEFECTO, ...JSON.parse(crudo) }
      : { ...AJUSTES_POR_DEFECTO };
  } catch (e) {
    console.warn('No se pudieron leer los ajustes:', e);
    return { ...AJUSTES_POR_DEFECTO };
  }
}

export async function guardarAjustes(ajustes) {
  await AsyncStorage.setItem(CLAVE_AJUSTES, JSON.stringify(ajustes));
}
