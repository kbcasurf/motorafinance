import { create } from 'zustand';
import { getAllSettings, setSetting } from '../db/queries/settings';

interface SettingsState {
  driverName: string;
  vehicleModel: string;
  monthlyGoal: string;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  updateSetting: (key: string, value: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  driverName: '',
  vehicleModel: '',
  monthlyGoal: '',
  hydrated: false,

  hydrate: async () => {
    const all = await getAllSettings();
    set({
      driverName: all['driver_name'] ?? '',
      vehicleModel: all['vehicle_model'] ?? '',
      monthlyGoal: all['monthly_goal'] ?? '',
      hydrated: true,
    });
  },

  updateSetting: async (key: string, value: string) => {
    await setSetting(key, value);
    // Map DB key to store field
    switch (key) {
      case 'driver_name':
        set({ driverName: value });
        break;
      case 'vehicle_model':
        set({ vehicleModel: value });
        break;
      case 'monthly_goal':
        set({ monthlyGoal: value });
        break;
    }
  },
}));
