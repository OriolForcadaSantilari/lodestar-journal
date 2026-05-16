import { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import BlinkingCursor from './BlinkingCursor';

// Escribe el texto carácter a carácter con un cursor de bloque al final.
// Si animate=false, muestra el texto completo de inmediato (cursor sigue parpadeando).
export default function Typewriter({ text, animate = true, speed = 40, style }) {
  const [n, setN] = useState(animate ? 0 : text.length);
  const ref = useRef();

  useEffect(() => {
    clearInterval(ref.current);
    if (!animate) {
      setN(text.length);
      return;
    }
    setN(0);
    ref.current = setInterval(() => {
      setN((prev) => {
        if (prev >= text.length) {
          clearInterval(ref.current);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
    return () => clearInterval(ref.current);
  }, [text, animate, speed]);

  return (
    <Text style={style}>
      {text.slice(0, n)}
      <BlinkingCursor style={style} />
    </Text>
  );
}
