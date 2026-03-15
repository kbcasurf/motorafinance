import { View, StyleSheet, ViewProps } from 'react-native';
import { useThemeColors, spacing, borderRadius } from '../../theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, style, ...props }: CardProps) {
  const colors = useThemeColors();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
});
