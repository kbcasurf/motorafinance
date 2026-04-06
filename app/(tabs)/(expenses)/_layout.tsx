import { Stack } from 'expo-router';
import { useThemeColors } from '../../../src/theme';

export default function ExpensesLayout() {
  const colors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Despesas', headerShown: false }} />
      <Stack.Screen name="new" options={{ title: 'Nova Despesa' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar Despesa' }} />
    </Stack>
  );
}
