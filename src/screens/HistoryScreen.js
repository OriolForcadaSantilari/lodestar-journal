import { useCallback, useLayoutEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { obtenerTodasLasEntradas } from '../storage';

export default function HistoryScreen({ navigation }) {
  const { t } = useTranslation();
  const [entradas, setEntradas] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t('history.title') });
  }, [navigation, t]);

  // Se recarga cada vez que la pantalla recibe el foco (al volver de borrar).
  useFocusEffect(
    useCallback(() => {
      let activo = true;
      obtenerTodasLasEntradas().then((lista) => {
        if (activo) setEntradas(lista);
      });
      return () => {
        activo = false;
      };
    }, [])
  );

  if (entradas !== null && entradas.length === 0) {
    return (
      <View style={styles.vacioContenedor}>
        <Text style={styles.vacioTexto}>{t('history.empty')}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.lista}
      contentContainerStyle={styles.listaContenido}
      data={entradas || []}
      keyExtractor={(item) => item.clave}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('EntryDetail', { clave: item.clave })
          }
        >
          <Text style={styles.itemFecha}>{item.fecha}</Text>
          <Text style={styles.itemPregunta} numberOfLines={2}>
            {item.pregunta}
          </Text>
          <Text style={styles.itemRespuesta} numberOfLines={2}>
            {item.respuesta}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  listaContenido: {
    padding: 20,
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECE9E2',
    padding: 20,
    marginBottom: 14,
  },
  itemFecha: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B2B2B',
    marginBottom: 6,
  },
  itemPregunta: {
    fontSize: 13,
    color: '#9A958C',
    marginBottom: 10,
  },
  itemRespuesta: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5C594F',
  },
  vacioContenedor: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  vacioTexto: {
    fontSize: 18,
    lineHeight: 28,
    color: '#9A958C',
    textAlign: 'center',
  },
});
