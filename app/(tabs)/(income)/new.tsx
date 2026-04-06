import { useState } from 'react';
import { useRouter } from 'expo-router';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { IncomeForm } from '../../../src/components/forms/IncomeForm';
import { insertIncome, getIncomeByDate } from '../../../src/db/queries/income';
import { useIncomeStore } from '../../../src/stores/useIncomeStore';
import type { NewIncome } from '../../../src/db/queries/income';

export default function NewIncomeScreen() {
  const router = useRouter();
  const { lastPlatform, lastOdoEnd, setLastPlatform, setLastOdoEnd } = useIncomeStore();
  const [dateError, setDateError] = useState<string | undefined>();

  async function handleSubmit(data: NewIncome) {
    const existing = await getIncomeByDate(data.date);
    if (existing) {
      const formatted = format(parseISO(data.date), 'dd/MM/yyyy', { locale: ptBR });
      setDateError(`Já existe uma entrada para ${formatted}. Edite o registro existente na lista.`);
      return;
    }
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
      dateError={dateError}
      onClearDateError={() => setDateError(undefined)}
    />
  );
}
