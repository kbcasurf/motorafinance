import { create } from 'zustand';
import { getAllSettings, setSetting } from '../db/queries/settings';

interface SettingsState {
  driverName: string;
  vehicleModel: string;
  monthlyGoal: string;
  darkTheme: boolean;
  hydrated: boolean;
  tankCapacityMl: string;
  consumptionEthanolUrban: string;
  consumptionEthanolHighway: string;
  consumptionGasolineUrban: string;
  consumptionGasolineHighway: string;
  hydrate: () => Promise<void>;
  updateSetting: (key: string, value: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  driverName: '',
  vehicleModel: '',
  monthlyGoal: '',
  darkTheme: false,
  hydrated: false,
  tankCapacityMl: '',
  consumptionEthanolUrban: '',
  consumptionEthanolHighway: '',
  consumptionGasolineUrban: '',
  consumptionGasolineHighway: '',

  hydrate: async () => {
    try {
      const all = await getAllSettings();
      set({
        driverName: all['driver_name'] ?? '',
        vehicleModel: all['vehicle_model'] ?? '',
        monthlyGoal: all['monthly_goal'] ?? '',
        darkTheme: all['dark_theme'] === 'true',
        hydrated: true,
        tankCapacityMl: all['tank_capacity_ml'] ?? '',
        consumptionEthanolUrban: all['consumption_ethanol_urban'] ?? '',
        consumptionEthanolHighway: all['consumption_ethanol_highway'] ?? '',
        consumptionGasolineUrban: all['consumption_gasoline_urban'] ?? '',
        consumptionGasolineHighway: all['consumption_gasoline_highway'] ?? '',
      });
    } catch (error) {
      console.error('Failed to hydrate settings:', error);
      set({ hydrated: true });
    }
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
      case 'tank_capacity_ml':
        set({ tankCapacityMl: value });
        break;
      case 'consumption_ethanol_urban':
        set({ consumptionEthanolUrban: value });
        break;
      case 'consumption_ethanol_highway':
        set({ consumptionEthanolHighway: value });
        break;
      case 'consumption_gasoline_urban':
        set({ consumptionGasolineUrban: value });
        break;
      case 'consumption_gasoline_highway':
        set({ consumptionGasolineHighway: value });
        break;
    }
  },
}));
