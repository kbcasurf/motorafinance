import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../drizzle/migrations';
import { useSettingsStore } from '../src/stores/useSettingsStore';
import { useThemeColors } from '../src/theme';

const expo = openDatabaseSync('driverfinance.db', {
  enableChangeListener: true,
});

export const db = drizzle(expo);

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const colors = useThemeColors();

  useEffect(() => {
    if (success) {
      hydrateSettings();
    }
  }, [success, hydrateSettings]);

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.negative }]}>Erro ao inicializar banco de dados</Text>
        <Text style={[styles.errorDetail, { color: colors.textSecondary }]}>{error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loading, { color: colors.textSecondary }]}>Carregando...</Text>
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
  loading: { marginTop: 16, fontSize: 16 },
  error: { fontSize: 18, fontWeight: 'bold' },
  errorDetail: { marginTop: 8, fontSize: 14 },
});
