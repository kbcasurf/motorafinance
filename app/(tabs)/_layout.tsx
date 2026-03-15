import { Tabs } from 'expo-router';
import { useThemeColors } from '../../src/theme';

export default function TabLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.icon,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tabs.Screen
        name="(income)"
        options={{
          title: 'Receitas',
          tabBarLabel: 'Receitas',
        }}
      />
      <Tabs.Screen
        name="(expenses)"
        options={{
          title: 'Despesas',
          tabBarLabel: 'Despesas',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarLabel: 'Ajustes',
        }}
      />
    </Tabs>
  );
}
