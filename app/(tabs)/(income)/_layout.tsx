import { Stack } from 'expo-router';

export default function IncomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Receitas', headerShown: false }} />
      <Stack.Screen name="new" options={{ title: 'Nova Receita' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar Receita' }} />
    </Stack>
  );
}
