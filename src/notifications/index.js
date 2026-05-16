import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import i18n from '../i18n';

// Identificador fijo: programar de nuevo reemplaza el recordatorio anterior.
const DAILY_ID = 'daily-reminder';

// Mostrar la notificación aunque la app esté en primer plano.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    // Compatibilidad con versiones antiguas de expo-notifications.
    shouldShowAlert: true,
  }),
});

async function asegurarCanalAndroid() {
  if (Platform.OS !== 'android') return;
  try {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Recordatorios',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  } catch (e) {
    console.warn('No se pudo crear el canal de Android:', e);
  }
}

// Pide permiso al usuario. Devuelve true/false según se concedió.
export async function requestPermissions() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (e) {
    console.warn('Error pidiendo permisos de notificación:', e);
    return false;
  }
}

// Devuelve el estado actual del permiso sin pedirlo ('granted' | 'denied' | 'undetermined').
export async function getPermissionStatus() {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  } catch (e) {
    console.warn('Error consultando el estado del permiso:', e);
    return 'undetermined';
  }
}

// Cancela el recordatorio diario anterior y programa uno nuevo que se repite cada día.
export async function scheduleDailyReminder(hour, minute) {
  try {
    await asegurarCanalAndroid();
    await cancelDailyReminder();
    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_ID,
      content: {
        title: i18n.t('settings.notificationTitle'),
        body: i18n.t('settings.notificationBody'),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    return true;
  } catch (e) {
    console.warn('No se pudo programar el recordatorio diario:', e);
    return false;
  }
}

export async function cancelDailyReminder() {
  try {
    await Notifications.cancelScheduledNotificationAsync(DAILY_ID);
  } catch (e) {
    console.warn('No se pudo cancelar el recordatorio diario:', e);
  }
}

// Notificación de prueba a los 5 segundos para verificar que funciona.
export async function sendTestNotification() {
  try {
    await asegurarCanalAndroid();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t('settings.notificationTitle'),
        body: i18n.t('settings.notificationBody'),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
        repeats: false,
      },
    });
    return true;
  } catch (e) {
    console.warn('No se pudo enviar la notificación de prueba:', e);
    return false;
  }
}
