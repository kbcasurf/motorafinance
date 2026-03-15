import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../drizzle/migrations';
import { useSettingsStore } from '../src/stores/useSettingsStore';

const expo = openDatabaseSync('driverfinance.db', {
  enableChangeListener: true,
});

export const db = drizzle(expo);

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);

  useEffect(() => {
    if (success) {
      hydrateSettings();
    }
  }, [success, hydrateSettings]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Erro ao inicializar banco de dados</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loading}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loading: { marginTop: 16, fontSize: 16, color: '#6B7280' },
  error: { fontSize: 18, fontWeight: 'bold', color: '#DC2626' },
  errorDetail: { marginTop: 8, fontSize: 14, color: '#6B7280' },
});
