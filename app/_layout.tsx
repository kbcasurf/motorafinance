import { useCallback, useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { db, expoDb } from '../src/db/client';
import migrations from '../drizzle/migrations/migrations';
import { useSettingsStore } from '../src/stores/useSettingsStore';
import { useThemeColors } from '../src/theme';
import { useFonts, Exo2_700Bold } from '@expo-google-fonts/exo-2';
import { validateSchema, resetDatabase } from '../src/db/validateAndSync';

export { db };

/**
 * Imperative migration flow: instead of useMigrations (a React hook that
 * cannot be re-mounted from React Native), we call migrate() directly
 * inside a useEffect, giving us full control over the lifecycle.
 */
export default function RootLayout() {
  const [status, setStatus] = useState<'migrating' | 'migrated' | 'error'>('migrating');
  const [errorMsg, setErrorMsg] = useState('');
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const colors = useThemeColors();
  const [fontsLoaded] = useFonts({ Exo2_700Bold });

  const runMigrations = useCallback(async () => {
    try {
      await migrate(db, migrations);
      const ok = await validateSchema();
      if (!ok) {
        // Migrations reported success but schema is still stale — reset and retry
        await resetDatabase();
        await migrate(db, migrations);
      }
      hydrateSettings();
      setStatus('migrated');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Migration failed:', err);
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setStatus('error');
    }
  }, [hydrateSettings]);

  useEffect(() => {
    runMigrations();
  }, [runMigrations]);

  if (status === 'error') {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.negative }]}>Erro ao inicializar banco de dados</Text>
        <Text style={[styles.errorDetail, { color: colors.textSecondary }]}>{errorMsg}</Text>
      </View>
    );
  }

  if (status !== 'migrated' || !fontsLoaded) {
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
