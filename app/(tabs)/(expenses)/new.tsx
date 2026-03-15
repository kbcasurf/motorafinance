import { useRouter } from 'expo-router';
import { ExpenseForm } from '../../../src/components/forms/ExpenseForm';
import { insertExpense } from '../../../src/db/queries/expenses';
import { useExpenseStore } from '../../../src/stores/useExpenseStore';
import type { NewExpense } from '../../../src/db/queries/expenses';

export default function NewExpenseScreen() {
  const router = useRouter();
  const { lastCategory, setLastCategory } = useExpenseStore();

  async function handleSubmit(data: NewExpense) {
    await insertExpense(data);
    setLastCategory(data.category);
    router.back();
  }

  return (
    <ExpenseForm
      defaultCategory={lastCategory}
      onSubmit={handleSubmit}
      submitLabel="Salvar despesa"
    />
  );
}
