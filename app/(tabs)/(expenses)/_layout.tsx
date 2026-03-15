import { Stack } from 'expo-router';

export default function ExpensesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Despesas', headerShown: false }} />
      <Stack.Screen name="new" options={{ title: 'Nova Despesa' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar Despesa' }} />
    </Stack>
  );
}
