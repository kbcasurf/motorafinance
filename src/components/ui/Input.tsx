import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useThemeColors, spacing, borderRadius, fontSize } from '../../theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: error ? colors.negative : colors.border,
          },
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && <Text style={[styles.error, { color: colors.negative }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { fontSize: fontSize.sm, marginBottom: spacing.xs, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm + 2,
    fontSize: fontSize.md,
  },
  error: { fontSize: fontSize.xs, marginTop: spacing.xs },
});
