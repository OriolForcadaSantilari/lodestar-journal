import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { borrarEntrada, obtenerEntrada } from '../storage';
import { stardateDesdeClave } from '../preguntas';
import { colors, font, glow } from '../theme';
import CRTScreen from '../components/CRTScreen';

export default function EntryDetailScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { clave } = route.params;
  const stardateTexto = useMemo(() => stardateDesdeClave(clave), [clave]);
  const [entrada, setEntrada] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      obtenerEntrada(clave).then((e) => {
        if (activo) setEntrada(e);
      });
      return () => {
        activo = false;
      };
    }, [clave])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('detail.title', { date: stardateTexto }),
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              t('history.deleteConfirmTitle'),
              t('history.deleteConfirmMessage'),
              [
                { text: t('history.cancel'), style: 'cancel' },
                {
                  text: t('history.delete'),
                  style: 'destructive',
                  onPress: async () => {
                    await borrarEntrada(clave);
                    navigation.goBack();
                  },
                },
              ]
            )
          }
        >
          <Text style={styles.borrar}>{t('history.delete')}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, clave, stardateTexto, t]);

  return (
    <CRTScreen>
      {entrada && (
        <ScrollView style={styles.flex} contentContainerStyle={styles.contenido}>
          <Text style={styles.stardate}>{'> STARDATE ' + stardateTexto}</Text>
          <Text style={styles.fecha}>{entrada.fecha}</Text>
          <Text style={styles.pregunta}>{entrada.pregunta}</Text>
          <Text style={styles.respuesta}>{entrada.respuesta}</Text>
        </ScrollView>
      )}
    </CRTScreen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  contenido: {
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  stardate: {
    fontFamily: font,
    fontSize: 26,
    color: colors.green,
    ...glow(),
    marginBottom: 2,
  },
  fecha: {
    fontFamily: font,
    fontSize: 18,
    color: colors.greenDim,
    marginBottom: 28,
  },
  pregunta: {
    fontFamily: font,
    fontSize: 24,
    lineHeight: 30,
    color: colors.greenDim,
    marginBottom: 24,
  },
  respuesta: {
    fontFamily: font,
    fontSize: 24,
    lineHeight: 32,
    color: colors.green,
    ...glow(),
  },
  borrar: {
    fontFamily: font,
    fontSize: 20,
    color: colors.danger,
    ...glow(colors.danger, 5),
  },
});
