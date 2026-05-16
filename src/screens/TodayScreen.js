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
} from '../preguntas';
import { guardarEntrada, obtenerEntrada } from '../storage';

const LIMITE = 280;

export default function TodayScreen({ navigation }) {
  const { t } = useTranslation();
  const hoy = useMemo(() => new Date(), []);
  const clave = useMemo(() => claveFecha(hoy), [hoy]);
  const fechaTexto = useMemo(() => formatearFecha(hoy), [hoy]);
  const pregunta = useMemo(() => preguntaDelDia(hoy), [hoy]);
  const [respuesta, setRespuesta] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('today.title'),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.headerBoton}>
            ⚙ {t('today.settingsButton')}
          </Text>
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
        if (activo && entrada) setRespuesta(entrada.respuesta);
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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contenido}>
          <Text style={styles.fecha}>{fechaTexto}</Text>

          <Text style={styles.pregunta}>{pregunta}</Text>

          <TextInput
            style={styles.input}
            placeholder={t('today.placeholder')}
            placeholderTextColor="#B0B0B0"
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
            activeOpacity={0.8}
          >
            <Text style={styles.botonTexto}>{t('today.save')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#FAF9F6',
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
  fecha: {
    fontSize: 15,
    color: '#9A958C',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 28,
  },
  pregunta: {
    fontSize: 26,
    lineHeight: 36,
    fontWeight: '600',
    color: '#2B2B2B',
    textAlign: 'center',
    marginBottom: 36,
  },
  input: {
    minHeight: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECE9E2',
    padding: 18,
    fontSize: 17,
    lineHeight: 24,
    color: '#2B2B2B',
  },
  contador: {
    fontSize: 13,
    color: '#B0ABA1',
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 32,
  },
  boton: {
    backgroundColor: '#2B2B2B',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  headerBoton: {
    fontSize: 16,
    color: '#2B2B2B',
    fontWeight: '600',
  },
});
