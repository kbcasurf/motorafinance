import { create } from 'zustand';
import { getAllSettings, setSetting } from '../db/queries/settings';

interface SettingsState {
  driverName: string;
  vehicleModel: string;
  monthlyGoal: string;
  darkTheme: boolean;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  updateSetting: (key: string, value: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  driverName: '',
  vehicleModel: '',
  monthlyGoal: '',
  darkTheme: false,
  hydrated: false,

  hydrate: async () => {
    const all = await getAllSettings();
    set({
      driverName: all['driver_name'] ?? '',
      vehicleModel: all['vehicle_model'] ?? '',
      monthlyGoal: all['monthly_goal'] ?? '',
      darkTheme: all['dark_theme'] === 'true',
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
      case 'dark_theme':
        set({ darkTheme: value === 'true' });
        break;
    }
  },
}));
