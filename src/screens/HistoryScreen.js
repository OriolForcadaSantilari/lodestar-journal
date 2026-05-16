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
import { stardateDesdeClave } from '../preguntas';
import { colors, font, glow } from '../theme';
import CRTScreen from '../components/CRTScreen';

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
      <CRTScreen>
        <View style={styles.vacioContenedor}>
          <Text style={styles.vacioTexto}>{t('history.empty')}</Text>
        </View>
      </CRTScreen>
    );
  }

  return (
    <CRTScreen>
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
            <Text style={styles.itemStardate}>
              {'> STARDATE ' + stardateDesdeClave(item.clave)}
            </Text>
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
    </CRTScreen>
  );
}

const styles = StyleSheet.create({
  lista: {
    flex: 1,
  },
  listaContenido: {
    padding: 20,
  },
  item: {
    backgroundColor: colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.greenFaint,
    padding: 18,
    marginBottom: 14,
  },
  itemStardate: {
    fontFamily: font,
    fontSize: 20,
    color: colors.green,
    ...glow(),
    marginBottom: 2,
  },
  itemFecha: {
    fontFamily: font,
    fontSize: 16,
    color: colors.greenDim,
    marginBottom: 10,
  },
  itemPregunta: {
    fontFamily: font,
    fontSize: 18,
    color: colors.greenDim,
    marginBottom: 8,
  },
  itemRespuesta: {
    fontFamily: font,
    fontSize: 20,
    lineHeight: 24,
    color: colors.green,
  },
  vacioContenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  vacioTexto: {
    fontFamily: font,
    fontSize: 24,
    lineHeight: 32,
    color: colors.green,
    ...glow(),
    textAlign: 'center',
  },
});
