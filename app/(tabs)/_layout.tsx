import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image, Text, View } from 'react-native';
import { useThemeColors } from '../../src/theme';

export default function TabLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image
              source={require('../../assets/icon.png')}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
            <Text style={{ fontFamily: 'Exo2_700Bold', fontSize: 18, letterSpacing: 0.7, color: colors.text }}>
              {'Driver'}<Text style={{ color: colors.primary }}>{'Finance'}</Text>
            </Text>
          </View>
        ),
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(income)"
        options={{
          title: 'Receitas',
          tabBarLabel: 'Receitas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(expenses)"
        options={{
          title: 'Despesas',
          tabBarLabel: 'Despesas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarLabel: 'Ajustes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
