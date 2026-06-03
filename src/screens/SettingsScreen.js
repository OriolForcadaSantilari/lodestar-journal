import { useCallback, useLayoutEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { obtenerAjustes, guardarAjustes } from '../storage';
import {
  cancelDailyReminder,
  requestPermissions,
  scheduleDailyReminder,
  sendTestNotification,
} from '../notifications';
import {
  obtenerPreferenciaIdioma,
  guardarPreferenciaIdioma,
} from '../i18n';
import { colors, font, glow } from '../theme';
import CRTScreen from '../components/CRTScreen';

function fechaDesde(hora, minuto) {
  const d = new Date();
  d.setHours(hora, minuto, 0, 0);
  return d;
}

const IDIOMAS = [
  { valor: 'auto', clave: 'settings.languageAuto' },
  { valor: 'es', clave: 'settings.languageEs' },
  { valor: 'en', clave: 'settings.languageEn' },
];

export default function SettingsScreen({ navigation }) {
  const { t } = useTranslation();
  const [cargando, setCargando] = useState(true);
  const [activo, setActivo] = useState(false);
  const [hora, setHora] = useState(fechaDesde(21, 0));
  const [permisoDenegado, setPermisoDenegado] = useState(false);
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [idiomaPref, setIdiomaPref] = useState('auto');

  useLayoutEffect(() => {
    navigation.setOptions({ title: t('settings.title') });
  }, [navigation, t]);

  // Al abrir, refleja el estado realmente guardado.
  useFocusEffect(
    useCallback(() => {
      let activoEfecto = true;
      Promise.all([obtenerAjustes(), obtenerPreferenciaIdioma()]).then(
        ([aj, pref]) => {
          if (!activoEfecto) return;
          setActivo(aj.recordatorioActivo);
          setHora(fechaDesde(aj.hora, aj.minuto));
          setIdiomaPref(pref);
          setCargando(false);
        }
      );
      return () => {
        activoEfecto = false;
      };
    }, [])
  );

  const persistir = async (recordatorioActivo, fecha) => {
    await guardarAjustes({
      recordatorioActivo,
      hora: fecha.getHours(),
      minuto: fecha.getMinutes(),
    });
  };

  const alCambiarSwitch = async (valor) => {
    if (valor) {
      const concedido = await requestPermissions();
      if (!concedido) {
        setPermisoDenegado(true);
        setActivo(false);
        await persistir(false, hora);
        return;
      }
      setPermisoDenegado(false);
      setActivo(true);
      await persistir(true, hora);
      await scheduleDailyReminder(hora.getHours(), hora.getMinutes());
    } else {
      setActivo(false);
      await persistir(false, hora);
      await cancelDailyReminder();
    }
  };

  const alCambiarHora = async (evento, seleccionada) => {
    if (Platform.OS === 'android') setMostrarPicker(false);
    if (evento?.type === 'dismissed' || !seleccionada) return;
    setHora(seleccionada);
    await persistir(activo, seleccionada);
    if (activo) {
      await scheduleDailyReminder(
        seleccionada.getHours(),
        seleccionada.getMinutes()
      );
    }
  };

  const alCambiarIdioma = async (pref) => {
    if (pref === idiomaPref) return;
    setIdiomaPref(pref);
    await guardarPreferenciaIdioma(pref);
    // Si hay recordatorio activo, lo reprogramamos para que el texto
    // de la notificación coja el idioma recién aplicado.
    if (activo) {
      await scheduleDailyReminder(hora.getHours(), hora.getMinutes());
    }
  };

  if (cargando) {
    return (
      <CRTScreen>
        <View style={styles.contenedor} />
      </CRTScreen>
    );
  }

  return (
    <CRTScreen>
      <View style={styles.contenedor}>
        <View style={styles.bloque}>
          <Text style={styles.label}>{t('settings.languageLabel')}</Text>
          <View style={styles.filaIdiomas}>
            {IDIOMAS.map((op) => {
              const seleccionado = op.valor === idiomaPref;
              return (
                <TouchableOpacity
                  key={op.valor}
                  style={[
                    styles.botonIdioma,
                    seleccionado && styles.botonIdiomaActivo,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => alCambiarIdioma(op.valor)}
                >
                  <Text
                    style={[
                      styles.botonIdiomaTexto,
                      seleccionado && styles.botonIdiomaTextoActivo,
                    ]}
                  >
                    {t(op.clave)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.bloque, styles.fila]}>
          <Text style={styles.label}>{t('settings.reminderLabel')}</Text>
          <Switch
            value={activo}
            onValueChange={alCambiarSwitch}
            trackColor={{ false: colors.greenFaint, true: colors.greenDim }}
            thumbColor={activo ? colors.green : colors.surface}
            ios_backgroundColor={colors.greenFaint}
          />
        </View>

        {permisoDenegado && (
          <Text style={styles.aviso}>{t('settings.permissionDenied')}</Text>
        )}

        {activo && (
          <View style={styles.bloqueHora}>
            <Text style={styles.label}>{t('settings.timeLabel')}</Text>
            {Platform.OS === 'ios' ? (
              <DateTimePicker
                value={hora}
                mode="time"
                display="spinner"
                onChange={alCambiarHora}
                themeVariant="dark"
                textColor={colors.green}
                accentColor={colors.green}
                style={styles.picker}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.botonHora}
                  onPress={() => setMostrarPicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.botonHoraTexto}>
                    {String(hora.getHours()).padStart(2, '0')}:
                    {String(hora.getMinutes()).padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
                {mostrarPicker && (
                  <DateTimePicker
                    value={hora}
                    mode="time"
                    display="default"
                    onChange={alCambiarHora}
                  />
                )}
              </>
            )}
          </View>
        )}

        <TouchableOpacity
          style={styles.botonPrueba}
          onPress={sendTestNotification}
          activeOpacity={0.7}
        >
          <Text style={styles.botonPruebaTexto}>
            {t('settings.testButton')}
          </Text>
        </TouchableOpacity>
      </View>
    </CRTScreen>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  bloque: {
    marginBottom: 28,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: font,
    fontSize: 24,
    color: colors.green,
    ...glow(),
    marginBottom: 12,
  },
  filaIdiomas: {
    flexDirection: 'row',
    gap: 8,
  },
  botonIdioma: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.greenFaint,
    borderRadius: 4,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botonIdiomaActivo: {
    borderColor: colors.green,
    backgroundColor: '#10261A',
  },
  botonIdiomaTexto: {
    fontFamily: font,
    fontSize: 20,
    color: colors.greenDim,
  },
  botonIdiomaTextoActivo: {
    color: colors.green,
    ...glow(),
  },
  aviso: {
    fontFamily: font,
    fontSize: 20,
    lineHeight: 26,
    color: colors.greenDim,
    marginTop: 4,
    marginBottom: 16,
  },
  bloqueHora: {
    marginTop: 8,
  },
  picker: {
    marginTop: 8,
    alignSelf: 'center',
  },
  botonHora: {
    marginTop: 14,
    backgroundColor: colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.green,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botonHoraTexto: {
    fontFamily: font,
    fontSize: 28,
    color: colors.green,
    ...glow(),
    letterSpacing: 2,
  },
  botonPrueba: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: 14,
  },
  botonPruebaTexto: {
    fontFamily: font,
    fontSize: 20,
    color: colors.greenDim,
  },
});
