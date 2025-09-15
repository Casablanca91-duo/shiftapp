import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import ShiftStore from '../stores/ShiftStore';
import GeolocationService from '../services/GeolocationService';
import ApiService from '../services/ApiService';
import ShiftCard from '../components/ShiftCard';

interface Props {
  navigation: any;
}

const ShiftListScreen: React.FC<Props> = observer(({ navigation }) => {
  const [initializing, setInitializing] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const hasPermission = await GeolocationService.requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Доступ к геолокации', 
          'Приложению нужен доступ к геолокации для поиска смен. Пожалуйста, разрешите доступ в настройках устройства.',
          [{ text: 'OK' }]
        );
        setInitializing(false);
        return;
      }

      const position = await GeolocationService.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      ShiftStore.setCurrentLocation({ latitude, longitude });
      
      // Получаем список смен
      await loadShifts(latitude, longitude);
      
    } catch (error: any) {
      console.error('Initialization error:', error);
      Alert.alert(
        'Ошибка', 
        error.message || 'Не удалось получить данные. Проверьте подключение к интернету.',
        [{ text: 'OK' }]
      );
    } finally {
      setInitializing(false);
    }
  };

  const loadShifts = async (latitude: number, longitude: number) => {
    try {
      ShiftStore.setLoading(true);
      ShiftStore.setError(null);
      const response = await ApiService.getShiftsByLocation(latitude, longitude);
      ShiftStore.setShifts(response.data);
    } catch (error: any) {
      console.error('Load shifts error:', error);
      ShiftStore.setError(error.message || 'Ошибка загрузки смен');
      Alert.alert(
        'Ошибка загрузки', 
        'Не удалось загрузить список смен. Потяните вниз для повтора.',
        [{ text: 'OK' }]
      );
    } finally {
      ShiftStore.setLoading(false);
    }
  };

  const onRefresh = async () => {
    if (ShiftStore.currentLocation) {
      setRefreshing(true);
      await loadShifts(
        ShiftStore.currentLocation.latitude,
        ShiftStore.currentLocation.longitude
      );
      setRefreshing(false);
    }
  };

  const handleShiftPress = (shiftId: string) => {
    navigation.navigate('ShiftDetails', { shiftId });
  };

  if (initializing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Получение геолокации...</Text>
        <Text style={styles.subText}>Пожалуйста, разрешите доступ к местоположению</Text>
      </View>
    );
  }

  if (ShiftStore.loading && ShiftStore.shifts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Загрузка смен...</Text>
        <Text style={styles.subText}>Ищем доступные смены рядом с вами</Text>
      </View>
    );
  }

  if (ShiftStore.error && ShiftStore.shifts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Ошибка: {ShiftStore.error}</Text>
        <Text style={styles.retryText}>Потяните вниз для повтора</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <FlatList
        data={ShiftStore.shifts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ShiftCard
            shift={item}
            onPress={() => handleShiftPress(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Смены не найдены</Text>
            <Text style={styles.emptySubText}>Попробуйте обновить список</Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              Доступные смены: {ShiftStore.shifts.length}
            </Text>
          </View>
        }
        contentContainerStyle={ShiftStore.shifts.length === 0 ? styles.emptyList : null}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  subText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  retryText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  headerContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptyList: {
    flexGrow: 1,
  },
});

export default ShiftListScreen;