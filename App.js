import './src/i18n';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodayScreen from './src/screens/TodayScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import EntryDetailScreen from './src/screens/EntryDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const headerStyles = {
  headerStyle: { backgroundColor: '#FAF9F6' },
  headerShadowVisible: false,
  headerTintColor: '#2B2B2B',
  headerTitleStyle: { fontWeight: '600', color: '#2B2B2B' },
  contentStyle: { backgroundColor: '#FAF9F6' },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
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
