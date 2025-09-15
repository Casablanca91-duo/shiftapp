import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

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
  const isFull = shift.currentWorkers >= shift.planWorkers;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        {shift.logo ? (
          <Image source={{ uri: shift.logo }} style={styles.logo} />
        ) : (
          <View style={styles.placeholderLogo} />
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.companyName} numberOfLines={1}>
            {shift.companyName}
          </Text>
          <Text style={styles.date}>
            {shift.dateStartByCity} • {shift.timeStartByCity}-{shift.timeEndByCity}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.address} numberOfLines={2}>
          {shift.address}
        </Text>
        <Text style={styles.workType}>{workType}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{shift.priceWorker} ₽</Text>
          <Text style={styles.perShift}>за смену</Text>
        </View>
        <View style={styles.workersContainer}>
          <Text style={styles.workers}>
            {shift.currentWorkers}/{shift.planWorkers}
          </Text>
          <Text style={styles.workersLabel}>чел.</Text>
        </View>
      </View>

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
    borderRadius: 8,
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
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  placeholderLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    marginBottom: 12,
  },
  address: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  workType: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#e3f2fd',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 4,
  },
  perShift: {
    fontSize: 12,
    color: '#666',
  },
  workersContainer: {
    alignItems: 'flex-end',
  },
  workers: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  workersLabel: {
    fontSize: 12,
    color: '#666',
  },
  fullBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#ff3b30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  fullText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ShiftCard;