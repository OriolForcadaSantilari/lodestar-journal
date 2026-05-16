import { memo, useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors } from '../theme';

// Scanlines: líneas horizontales finas, muy sutiles, sin capturar toques.
const Scanlines = memo(function Scanlines({ height }) {
  const lineas = [];
  for (let y = 0; y < height; y += 4) {
    lineas.push(
      <View
        key={y}
        style={{
          position: 'absolute',
          top: y,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: 'rgba(0,0,0,0.20)',
        }}
      />
    );
  }
  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      removeClippedSubviews
    >
      {lineas}
    </View>
  );
});

// Contenedor CRT: fondo, flicker global muy sutil y scanlines decorativas.
export default function CRTScreen({ children }) {
  const { height } = useWindowDimensions();
  const opacidad = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let temporizador;
    let vivo = true;

    const programar = () => {
      const espera = 6000 + Math.random() * 4000; // 6-10 s
      temporizador = setTimeout(() => {
        if (!vivo) return;
        Animated.sequence([
          Animated.timing(opacidad, {
            toValue: 0.82,
            duration: 60,
            useNativeDriver: true,
          }),
          Animated.timing(opacidad, {
            toValue: 1,
            duration: 60,
            useNativeDriver: true,
          }),
        ]).start(() => vivo && programar());
      }, espera);
    };

    programar();
    return () => {
      vivo = false;
      clearTimeout(temporizador);
    };
  }, [opacidad]);

  return (
    <View style={styles.fondo}>
      <Animated.View style={[styles.fondo, { opacity: opacidad }]}>
        {children}
      </Animated.View>
      <Scanlines height={height} />
    </View>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
