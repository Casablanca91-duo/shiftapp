import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
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
        Alert.alert('Ошибка', 'Нет доступа к геолокации');
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
      Alert.alert('Ошибка', error.message || 'Не удалось получить данные');
    } finally {
      setInitializing(false);
    }
  };

  const loadShifts = async (latitude: number, longitude: number) => {
    try {
      ShiftStore.setLoading(true);
      const response = await ApiService.getShiftsByLocation(latitude, longitude);
      ShiftStore.setShifts(response.data);
    } catch (error: any) {
      console.error('Load shifts error:', error);
      ShiftStore.setError(error.message || 'Ошибка загрузки смен');
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
      </View>
    );
  }

  if (ShiftStore.loading && ShiftStore.shifts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Загрузка смен...</Text>
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
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Смены не найдены</Text>
          </View>
        }
        ListHeaderComponent={
          <Text style={styles.headerText}>
            Доступные смены: {ShiftStore.shifts.length}
          </Text>
        }
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
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: 'white',
  },
});

export default ShiftListScreen;