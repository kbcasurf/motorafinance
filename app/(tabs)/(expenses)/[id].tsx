import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ExpenseForm } from '../../../src/components/forms/ExpenseForm';
import { getExpenseById, updateExpense } from '../../../src/db/queries/expenses';
import type { Expense, NewExpense } from '../../../src/db/queries/expenses';

export default function EditExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getExpenseById(id).then((row) => {
      setData(row ?? null);
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(updated: NewExpense) {
    if (!id) return;
    await updateExpense(id, updated);
    router.back();
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>Despesa nao encontrada</Text>
      </View>
    );
  }

  return (
    <ExpenseForm
      initialData={data}
      onSubmit={handleSubmit}
      submitLabel="Atualizar despesa"
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
