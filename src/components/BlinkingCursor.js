import { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import { colors, font, glow } from '../theme';

// Cursor de bloque █ que parpadea cada ~530ms. Reutilizable.
export default function BlinkingCursor({ style, color = colors.green }) {
  const [visible, setVisible] = useState(true);
  const ref = useRef();

  useEffect(() => {
    ref.current = setInterval(() => setVisible((v) => !v), 530);
    return () => clearInterval(ref.current);
  }, []);

  return (
    <Text
      style={[
        { fontFamily: font, color },
        glow(color),
        style,
        { opacity: visible ? 1 : 0 },
      ]}
    >
      █
    </Text>
  );
}
