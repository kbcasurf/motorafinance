import { useEffect, useState } from 'react';
import { Alert, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ExtrasForm } from '../../../src/components/forms/ExtrasForm';
import { getExtraById, updateExtra } from '../../../src/db/queries/extras';
import type { Extra, NewExtra } from '../../../src/db/queries/extras';

export default function EditExtraScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<Extra | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getExtraById(id).then((row) => {
      setData(row ?? null);
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(updated: NewExtra) {
    if (!id) return;
    await updateExtra(id, updated);
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
        <Text>Deslocamento não encontrado</Text>
      </View>
    );
  }

  return (
    <ExtrasForm initialData={data} onSubmit={handleSubmit} submitLabel="Salvar" />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
