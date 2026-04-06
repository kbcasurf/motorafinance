import { Stack } from 'expo-router';
import { useThemeColors } from '../../../src/theme';

export default function ExtrasLayout() {
  const colors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Extras', headerShown: false }} />
      <Stack.Screen name="new" options={{ title: 'Novo Deslocamento' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar Deslocamento' }} />
    </Stack>
  );
}
