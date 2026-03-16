import { useSettingsStore } from '../stores/useSettingsStore';

const palette = {
  green500: '#22C55E',
  green600: '#16A34A',
  red500: '#EF4444',
  red600: '#DC2626',
  blue500: '#3B82F6',
  blue600: '#2563EB',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  white: '#FFFFFF',
  black: '#000000',
};

const lightColors = {
  background: palette.gray50,
  surface: palette.white,
  surfaceSecondary: palette.gray100,
  text: palette.gray900,
  textSecondary: palette.gray500,
  textInverse: palette.white,
  border: palette.gray200,
  primary: palette.blue600,
  primaryText: palette.white,
  positive: palette.green600,
  negative: palette.red600,
  icon: palette.gray500,
  tabBar: palette.white,
  tabBarBorder: palette.gray200,
};

const darkColors = {
  background: '#07090F',
  surface: '#0E1320',
  surfaceSecondary: '#111827',
  text: '#F0F4FF',
  textSecondary: 'rgba(240,244,255,0.55)',
  textInverse: '#07090F',
  border: 'rgba(255,255,255,0.07)',
  primary: '#00D9C8',
  primaryText: '#07090F',
  positive: '#A8FF3E',
  negative: '#FF6B6B',
  icon: 'rgba(240,244,255,0.55)',
  tabBar: '#0E1320',
  tabBarBorder: 'rgba(255,255,255,0.07)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export type ThemeColors = typeof lightColors;

export function useThemeColors(): ThemeColors {
  const darkTheme = useSettingsStore((s) => s.darkTheme);
  return darkTheme ? darkColors : lightColors;
}
