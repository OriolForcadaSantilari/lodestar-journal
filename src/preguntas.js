export const PREGUNTAS = [
  '¿Qué es lo que más agradeces hoy?',
  '¿Qué te hizo sonreír en las últimas horas?',
  '¿Qué emoción ha predominado en tu día y por qué?',
  '¿Qué pequeño detalle de hoy quieres recordar?',
  '¿Qué aprendiste sobre ti mismo esta semana?',
  '¿A quién te gustaría dar las gracias y por qué?',
  '¿Qué te quitó energía hoy y qué te la dio?',
  '¿Cuál fue el mejor momento del día?',
  '¿Qué te preocupa ahora mismo? Escríbelo sin filtro.',
  '¿Qué harías diferente si pudieras repetir hoy?',
  '¿Qué recuerdo de tu infancia te ha venido últimamente a la mente?',
  '¿Qué estás posponiendo y por qué?',
  '¿Cómo cuidaste de ti hoy?',
  '¿Qué te ilusiona de mañana?',
  '¿Qué persona ha sido importante para ti esta semana?',
  '¿Qué te dijo tu cuerpo hoy que no estabas escuchando?',
  '¿Cuál es una cosa simple que disfrutaste hoy?',
  '¿Qué miedo te gustaría soltar?',
  '¿De qué te sientes orgulloso aunque nadie lo note?',
  '¿Qué le dirías a tu yo de hace un año?',
];

// Clave estable por día en formato YYYY-MM-DD (hora local).
export function claveFecha(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

// Stardate a partir de una clave YYYY-MM-DD -> "YYYY.MM.DD".
export function stardateDesdeClave(clave) {
  return clave.replace(/-/g, '.');
}

// Stardate a partir de un Date -> "YYYY.MM.DD".
export function stardate(fecha) {
  return stardateDesdeClave(claveFecha(fecha));
}

// Convierte una clave YYYY-MM-DD de vuelta a un Date local.
export function fechaDesdeClave(clave) {
  const [anio, mes, dia] = clave.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

// Misma fecha = misma pregunta (determinista por día del año).
export function preguntaDelDia(fecha) {
  const inicioAnio = new Date(fecha.getFullYear(), 0, 0);
  const diff = fecha - inicioAnio;
  const diaDelAnio = Math.floor(diff / (1000 * 60 * 60 * 24));
  return PREGUNTAS[diaDelAnio % PREGUNTAS.length];
}

export function formatearFecha(fecha) {
  const texto = fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
