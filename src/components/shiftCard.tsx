import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { isShiftFull, getProgressColor } from '../utils/helpers';

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
}

interface ShiftCardProps {
  shift: Shift;
  onPress: () => void;
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shift, onPress }) => {
  const workType = shift.workTypes[0]?.name || 'Не указано';
  const isFull = isShiftFull(shift.currentWorkers, shift.planWorkers);
  const progress = (shift.currentWorkers / shift.planWorkers) * 100;
  const progressColor = getProgressColor(shift.currentWorkers, shift.planWorkers);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Шапка карточки */}
      <View style={styles.header}>
        {shift.logo ? (
          <Image 
            source={{ uri: shift.logo }} 
            style={styles.logo}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderLogo}>
            <Text style={styles.placeholderText}>
              {shift.companyName.charAt(0)}
            </Text>
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.companyName} numberOfLines={1}>
            {shift.companyName}
          </Text>
          <Text style={styles.date} numberOfLines={1}>
            {shift.dateStartByCity} • {shift.timeStartByCity}-{shift.timeEndByCity}
          </Text>
        </View>
      </View>

      {/* Адрес и тип работы */}
      <View style={styles.content}>
        <Text style={styles.address} numberOfLines={2}>
          {shift.address}
        </Text>
        <View style={styles.tagContainer}>
          <Text style={styles.workType}>{workType}</Text>
          {shift.isPromotionEnabled && (
            <Text style={styles.promotionTag}>Акция</Text>
          )}
        </View>
      </View>

      {/* Футер с информацией */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{shift.priceWorker.toLocaleString()}</Text>
          <Text style={styles.currency}>₽</Text>
          <Text style={styles.perShift}>за смену</Text>
        </View>
        
        <View style={styles.workersInfo}>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar,
                { 
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: progressColor
                }
              ]} 
            />
          </View>
          <Text style={styles.workersCount}>
            {shift.currentWorkers}/{shift.planWorkers}
          </Text>
        </View>
      </View>

      {/* Бейдж "Набрано" */}
      {isFull && (
        <View style={styles.fullBadge}>
          <Text style={styles.fullText}>Набрано</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  placeholderLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e3f2fd',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#666',
  },
  content: {
    marginBottom: 16,
  },
  address: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
    lineHeight: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  workType: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    overflow: 'hidden',
  },
  promotionTag: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#ff9500',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    overflow: 'hidden',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 4,
  },
  currency: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    marginRight: 4,
  },
  perShift: {
    fontSize: 12,
    color: '#666',
  },
  workersInfo: {
    alignItems: 'flex-end',
  },
  progressBarContainer: {
    height: 6,
    width: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  workersCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  fullBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#ff3b30',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  fullText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ShiftCard;