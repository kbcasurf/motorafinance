import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useThemeColors, spacing, borderRadius, fontSize } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
}

export function Button({ title, onPress, variant = 'primary', disabled = false }: ButtonProps) {
  const colors = useThemeColors();

  const containerStyle: ViewStyle =
    variant === 'primary'
      ? { backgroundColor: disabled ? colors.border : colors.primary }
      : { borderWidth: 1, borderColor: colors.border };

  const textStyle: TextStyle =
    variant === 'primary'
      ? { color: colors.primaryText }
      : { color: colors.primary };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        containerStyle,
        {
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});
