import { create } from 'zustand';

interface ExpenseStoreState {
  lastCategory: string;
  setLastCategory: (category: string) => void;
}

export const useExpenseStore = create<ExpenseStoreState>((set) => ({
  lastCategory: 'fuel',
  setLastCategory: (category) => set({ lastCategory: category }),
}));
