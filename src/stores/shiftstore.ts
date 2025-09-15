import { makeAutoObservable } from 'mobx';
import { Shift, Location } from '../types';

class ShiftStore {
  shifts: Shift[] = [];
  currentLocation: Location | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setShifts(shifts: Shift[]) {
    this.shifts = shifts;
  }

  setCurrentLocation(location: Location) {
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

  clearData() {
    this.shifts = [];
    this.currentLocation = null;
    this.error = null;
  }
}

export default new ShiftStore();