import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  claveFecha,
  formatearFecha,
  preguntaDelDia,
  stardate,
} from '../preguntas';
import { guardarEntrada, obtenerEntrada } from '../storage';
import { colors, font, glow } from '../theme';
import CRTScreen from '../components/CRTScreen';
import Typewriter from '../components/Typewriter';

const LIMITE = 280;

export default function TodayScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const hoy = useMemo(() => new Date(), []);
  const clave = useMemo(() => claveFecha(hoy), [hoy]);
  const fechaTexto = useMemo(
    () => formatearFecha(hoy),
    [hoy, i18n.language]
  );
  const stardateTexto = useMemo(() => stardate(hoy), [hoy]);
  const pregunta = useMemo(
    () => preguntaDelDia(hoy),
    [hoy, i18n.language]
  );
  const [respuesta, setRespuesta] = useState('');
  const [cargado, setCargado] = useState(false);
  const [yaTeniaRegistro, setYaTeniaRegistro] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('today.title'),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.headerBoton}>{t('today.settingsButton')}</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text style={styles.headerBoton}>{t('today.historyButton')}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, t]);

  // Al volver a esta pantalla, recargamos lo que ya estuviera guardado hoy.
  useFocusEffect(
    useCallback(() => {
      let activo = true;
      obtenerEntrada(clave).then((entrada) => {
        if (!activo) return;
        if (entrada) {
          setRespuesta(entrada.respuesta);
          setYaTeniaRegistro(true);
        }
        setCargado(true);
      });
      return () => {
        activo = false;
      };
    }, [clave])
  );

  const guardar = async () => {
    if (respuesta.trim().length === 0) {
      Alert.alert(t('today.emptyErrorTitle'), t('today.emptyError'));
      return;
    }
    await guardarEntrada({
      clave,
      fecha: fechaTexto,
      pregunta,
      respuesta: respuesta.trim(),
    });
    Alert.alert(t('today.saved'), t('today.savedMessage'));
  };

  return (
    <CRTScreen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contenido}>
            <Text style={styles.stardate}>
              {t('today.stardate', { date: stardateTexto })}
            </Text>
            <Text style={styles.fecha}>{fechaTexto}</Text>

            <Text style={styles.queryLog}>{t('today.queryLog')}</Text>
            {cargado && (
              <Typewriter
                text={pregunta}
                animate={!yaTeniaRegistro}
                speed={40}
                style={styles.pregunta}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder={t('today.placeholder')}
              placeholderTextColor={colors.greenDim}
              multiline
              maxLength={LIMITE}
              value={respuesta}
              onChangeText={setRespuesta}
              textAlignVertical="top"
            />

            <Text style={styles.contador}>
              {respuesta.length} / {LIMITE}
            </Text>

            <TouchableOpacity
              style={styles.boton}
              onPress={guardar}
              activeOpacity={0.7}
            >
              <Text style={styles.botonTexto}>{t('today.save')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CRTScreen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 48,
  },
  contenido: {
    width: '100%',
  },
  stardate: {
    fontFamily: font,
    fontSize: 22,
    color: colors.green,
    ...glow(),
    marginBottom: 2,
  },
  fecha: {
    fontFamily: font,
    fontSize: 18,
    color: colors.greenDim,
    marginBottom: 32,
  },
  queryLog: {
    fontFamily: font,
    fontSize: 20,
    color: colors.greenDim,
    marginBottom: 10,
  },
  pregunta: {
    fontFamily: font,
    fontSize: 38,
    lineHeight: 44,
    color: colors.green,
    ...glow(colors.green, 8),
    marginBottom: 36,
  },
  input: {
    minHeight: 150,
    backgroundColor: colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.greenFaint,
    padding: 16,
    fontFamily: font,
    fontSize: 22,
    lineHeight: 26,
    color: colors.green,
  },
  contador: {
    fontFamily: font,
    fontSize: 18,
    color: colors.greenDim,
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 32,
  },
  boton: {
    backgroundColor: colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.green,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botonTexto: {
    fontFamily: font,
    color: colors.green,
    fontSize: 24,
    ...glow(),
  },
  headerBoton: {
    fontFamily: font,
    fontSize: 20,
    color: colors.green,
    ...glow(),
  },
});
