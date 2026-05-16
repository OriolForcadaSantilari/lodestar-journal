// Tokens centrales del rediseño "terminal CRT de fósforo verde".
// Ninguna pantalla debe hardcodear colores: todo sale de aquí.

export const colors = {
  bg: '#0A0E0A', // fondo principal (negro con tinte verde)
  surface: '#0F140F', // tarjetas / inputs
  green: '#4AE56B', // texto principal (fósforo apagado)
  greenDim: '#2A8C3F', // texto secundario / placeholders
  greenFaint: '#1C3F24', // bordes / líneas
  danger: '#E5534A', // acción destructiva (borrar)
};

export const font = 'VT323_400Regular';

// Glow de fósforo: textShadow verde sutil (no borroso).
export function glow(color = colors.green, radius = 6) {
  return {
    textShadowColor: color,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: radius,
  };
}
