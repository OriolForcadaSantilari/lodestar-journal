import './src/i18n';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, VT323_400Regular } from '@expo-google-fonts/vt323';
import { colors, font } from './src/theme';
import { inicializarIdiomaDesdeStorage } from './src/i18n';
import TodayScreen from './src/screens/TodayScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import EntryDetailScreen from './src/screens/EntryDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

// Tema de navegación oscuro para que no haya destellos blancos entre pantallas.
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.green,
    border: colors.greenFaint,
    primary: colors.green,
  },
};

const headerStyles = {
  headerStyle: { backgroundColor: colors.bg },
  headerShadowVisible: false,
  headerTintColor: colors.green,
  headerTitleStyle: { fontFamily: font, color: colors.green, fontSize: 24 },
  contentStyle: { backgroundColor: colors.bg },
};

export default function App() {
  const [fuenteLista] = useFonts({ VT323_400Regular });
  const [idiomaListo, setIdiomaListo] = useState(false);

  useEffect(() => {
    inicializarIdiomaDesdeStorage().finally(() => setIdiomaListo(true));
  }, []);

  if (!fuenteLista || !idiomaListo) {
    // Pantalla de carga sin flash blanco mientras cargan fuente e idioma.
    return <View style={styles.carga} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={headerStyles}>
          <Stack.Screen name="Today" component={TodayScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="EntryDetail" component={EntryDetailScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  carga: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
