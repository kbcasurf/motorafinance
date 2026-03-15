import { useRouter } from 'expo-router';
import { IncomeForm } from '../../../src/components/forms/IncomeForm';
import { insertIncome } from '../../../src/db/queries/income';
import { useIncomeStore } from '../../../src/stores/useIncomeStore';
import type { NewIncome } from '../../../src/db/queries/income';

export default function NewIncomeScreen() {
  const router = useRouter();
  const { lastPlatform, lastOdoEnd, setLastPlatform, setLastOdoEnd } = useIncomeStore();

  async function handleSubmit(data: NewIncome) {
    await insertIncome(data);
    setLastPlatform(data.platform);
    if (data.odoEnd != null) {
      setLastOdoEnd(data.odoEnd);
    }
    router.back();
  }

  return (
    <IncomeForm
      defaultPlatform={lastPlatform}
      defaultOdoStart={lastOdoEnd}
      onSubmit={handleSubmit}
      submitLabel="Salvar receita"
    />
  );
}
