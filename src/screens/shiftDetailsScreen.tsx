import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import ShiftStore from '../stores/ShiftStore';

interface WorkType {
  id: number;
  name: string;
  nameGt5: string;
  nameLt5: string;
  nameOne: string;
}

interface Shift {
  id: string;
  logo: string;
  address: string;
  companyName: string;
  dateStartByCity: string;
  timeStartByCity: string;
  timeEndByCity: string;
  currentWorkers: number;
  planWorkers: number;
  workTypes: WorkType[];
  priceWorker: number;
  customerFeedbacksCount: string;
  customerRating: number | null;
  isPromotionEnabled: boolean;
  coordinates: {
    longitude: number;
    latitude: number;
  };
}

interface Props {
  route: any;
  navigation: any;
}

const ShiftDetailsScreen: React.FC<Props> = observer(({ route, navigation }) => {
  const { shiftId } = route.params;
  const [shift, setShift] = React.useState<Shift | null>(null);

  React.useEffect(() => {
    const foundShift = ShiftStore.getShiftById(shiftId);
    if (foundShift) {
      setShift(foundShift);
    } else {
      Alert.alert('Ошибка', 'Смена не найдена');
      navigation.goBack();
    }
  }, [shiftId, navigation]);

  const handleOpenMap = () => {
    if (shift?.coordinates) {
      const { latitude, longitude } = shift.coordinates;
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(url).catch(() => {
        Alert.alert('Ошибка', 'Не удалось открыть карту');
      });
    }
  };

  if (!shift) {
    return (
      <View style={styles.centerContainer}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  const workType = shift.workTypes[0]?.name || 'Не указано';
  const isFull = shift.currentWorkers >= shift.planWorkers;
  const progress = (shift.currentWorkers / shift.planWorkers) * 100;

  return (
    <ScrollView style={styles.container}>
      {/* Шапка с логотипом и информацией о компании */}
      <View style={styles.header}>
        {shift.logo ? (
          <Image source={{ uri: shift.logo }} style={styles.logo} />
        ) : (
          <View style={styles.placeholderLogo} />
        )}
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{shift.companyName}</Text>
          <Text style={styles.workTypeTag}>{workType}</Text>
        </View>
      </View>

      {/* Дата и время */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Время работы</Text>
        <View style={styles.timeInfo}>
          <Text style={styles.dateText}>{shift.dateStartByCity}</Text>
          <Text style={styles.timeText}>
            {shift.timeStartByCity} - {shift.timeEndByCity}
          </Text>
        </View>
      </View>

      {/* Адрес */}
      <TouchableOpacity style={styles.section} onPress={handleOpenMap}>
        <Text style={styles.sectionTitle}>Адрес</Text>
        <Text style={styles.addressText}>{shift.address}</Text>
        <Text style={styles.mapLink}>Открыть на карте</Text>
      </TouchableOpacity>

      {/* Оплата */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Оплата</Text>
        <View style={styles.paymentInfo}>
          <Text style={styles.price}>{shift.priceWorker} ₽</Text>
          <Text style={styles.priceLabel}>за смену</Text>
        </View>
      </View>

      {/* Набор сотрудников */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Набор сотрудников</Text>
        <View style={styles.workersInfo}>
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.min(progress, 100)}%` },
              ]}
            />
          </View>
          <View style={styles.workersTextContainer}>
            <Text style={styles.workersCount}>
              {shift.currentWorkers} из {shift.planWorkers}
            </Text>
            {isFull && (
              <Text style={styles.fullText}>Набор завершен</Text>
            )}
          </View>
        </View>
      </View>

      {/* Рейтинг */}
      {shift.customerRating !== null && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Рейтинг работодателя</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{shift.customerRating}</Text>
            <Text style={styles.reviews}>
              ({shift.customerFeedbacksCount})
            </Text>
          </View>
        </View>
      )}

      {/* Кнопка действия */}
      <View style={styles.buttonContainer}>
        {isFull ? (
          <TouchableOpacity style={[styles.actionButton, styles.disabledButton]}>
            <Text style={styles.actionButtonText}>Набор завершен</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Откликнуться</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
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
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  placeholderLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    marginRight: 16,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  workTypeTag: {
    fontSize: 14,
    color: '#007AFF',
    backgroundColor: '#e3f2fd',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 16,
    color: '#666',
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  mapLink: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  workersInfo: {
    marginBottom: 8,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  workersTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workersCount: {
    fontSize: 16,
    fontWeight: '600',
  },
  fullText: {
    fontSize: 14,
    color: '#ff3b30',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9500',
    marginRight: 8,
  },
  reviews: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ShiftDetailsScreen;