import { create } from 'zustand';

interface IncomeStoreState {
  lastPlatform: string;
  lastOdoEnd: number | null;
  setLastPlatform: (platform: string) => void;
  setLastOdoEnd: (odo: number | null) => void;
}

export const useIncomeStore = create<IncomeStoreState>((set) => ({
  lastPlatform: 'uber',
  lastOdoEnd: null,
  setLastPlatform: (platform) => set({ lastPlatform: platform }),
  setLastOdoEnd: (odo) => set({ lastOdoEnd: odo }),
}));
