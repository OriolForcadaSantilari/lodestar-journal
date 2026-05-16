import { useCallback, useLayoutEffect, useState } from 'react';
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

export default function EntryDetailScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { clave } = route.params;
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
      title: t('detail.title'),
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
  }, [navigation, clave, t]);

  if (!entrada) {
    return <View style={styles.flex} />;
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.contenido}>
      <Text style={styles.fecha}>{entrada.fecha}</Text>
      <Text style={styles.pregunta}>{entrada.pregunta}</Text>
      <Text style={styles.respuesta}>{entrada.respuesta}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  contenido: {
    paddingHorizontal: 28,
    paddingVertical: 36,
  },
  fecha: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 20,
  },
  pregunta: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#9A958C',
    marginBottom: 24,
  },
  respuesta: {
    fontSize: 18,
    lineHeight: 28,
    color: '#2B2B2B',
  },
  borrar: {
    fontSize: 16,
    color: '#C0392B',
    fontWeight: '600',
  },
});
