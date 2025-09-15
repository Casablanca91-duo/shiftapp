export interface WorkType {
  id: number;
  name: string;
  nameGt5: string;
  nameLt5: string;
  nameOne: string;
}

export interface Shift {
  id: string;
  logo: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  address: string;
  companyName: string;
  dateStartByCity: string;
  timeStartByCity: string;
  timeEndByCity: string;
  currentWorkers: number;
  planWorkers: number;
  workTypes: WorkType[];
  priceWorker: number;
  bonusPriceWorker: number;
  customerFeedbacksCount: string;
  customerRating: number | null;
  isPromotionEnabled: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
}