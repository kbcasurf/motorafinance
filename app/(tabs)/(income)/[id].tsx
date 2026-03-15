import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IncomeForm } from '../../../src/components/forms/IncomeForm';
import { getIncomeById, updateIncome } from '../../../src/db/queries/income';
import type { Income, NewIncome } from '../../../src/db/queries/income';

export default function EditIncomeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<Income | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getIncomeById(id).then((row) => {
      setData(row ?? null);
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(updated: NewIncome) {
    if (!id) return;
    await updateIncome(id, updated);
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
        <Text>Receita nao encontrada</Text>
      </View>
    );
  }

  return (
    <IncomeForm
      initialData={data}
      onSubmit={handleSubmit}
      submitLabel="Atualizar receita"
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
