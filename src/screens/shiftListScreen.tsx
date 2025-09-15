import * as React from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';
import ShiftStore from '../stores/ShiftStore';
import GeolocationService from '../services/GeolocationService';
import ApiService from '../services/ApiService';

interface Props {
  navigation: any;
}

const ShiftListScreen: React.FC<Props> = observer(({ navigation }) => {
  const [initializing, setInitializing] = React.useState(true);

  React.useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const hasPermission = await GeolocationService.requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Ошибка', 'Нет доступа к геолокации');
        setInitializing(false);
        return;
      }

      const position = await GeolocationService.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      ShiftStore.setCurrentLocation({ latitude, longitude });
      
      // Получаем список смен
      ShiftStore.setLoading(true);
      const response = await ApiService.getShiftsByLocation(latitude, longitude);
      ShiftStore.setShifts(response.data);
      ShiftStore.setLoading(false);
      
    } catch (error) {
      console.error('Initialization error:', error);
      Alert.alert('Ошибка', 'Не удалось получить данные');
      ShiftStore.setLoading(false);
    } finally {
      setInitializing(false);
    }
  };

  if (initializing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text>Получение геолокации...</Text>
      </View>
    );
  }

  if (ShiftStore.loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text>Загрузка смен...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Список смен</Text>
      <Text>Найдено смен: {ShiftStore.shifts.length}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShiftListScreen;