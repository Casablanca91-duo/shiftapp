import { makeAutoObservable } from 'mobx';

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
  workTypes: any[];
  priceWorker: number;
  customerFeedbacksCount: string;
  customerRating: number | null;
  isPromotionEnabled: boolean;
  coordinates: {
    longitude: number;
    latitude: number;
  };
}

class ShiftStore {
  shifts: Shift[] = [];
  currentLocation: { latitude: number; longitude: number } | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setShifts(shifts: Shift[]) {
    this.shifts = shifts;
  }

  setCurrentLocation(location: { latitude: number; longitude: number }) {
    this.currentLocation = location;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  getShiftById(id: string): Shift | undefined {
    return this.shifts.find(shift => shift.id === id);
  }
}

export default new ShiftStore();