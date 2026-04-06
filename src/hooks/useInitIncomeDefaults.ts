import { useEffect } from 'react';
import { getLastIncome } from '../db/queries/income';
import { useIncomeStore } from '../stores/useIncomeStore';

export function useInitIncomeDefaults() {
  const { setLastPlatform, setLastOdoEnd } = useIncomeStore();

  useEffect(() => {
    getLastIncome().then((last) => {
      if (!last) return;
      setLastPlatform(last.platform);
      if (last.odoEnd != null) {
        setLastOdoEnd(last.odoEnd);
      }
    }).catch((e) => {
      console.error('Failed to load last income:', e);
    });
  }, [setLastPlatform, setLastOdoEnd]);
}
