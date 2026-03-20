import { Stack } from 'expo-router';

export default function ExtrasLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Extras', headerShown: false }} />
      <Stack.Screen name="new" options={{ title: 'Novo Deslocamento' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar Deslocamento' }} />
    </Stack>
  );
}
