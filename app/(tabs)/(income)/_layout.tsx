import { Stack } from 'expo-router';
import { useThemeColors } from '../../../src/theme';

export default function IncomeLayout() {
  const colors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Receitas', headerShown: false }} />
      <Stack.Screen name="new" options={{ title: 'Nova Receita' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar Receita' }} />
    </Stack>
  );
}
