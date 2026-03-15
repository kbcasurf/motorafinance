// src/components/dashboard/KpiIndicators.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/currency';
import { useThemeColors, spacing, fontSize } from '../../theme';

interface KpiIndicatorsProps {
  revenuePerKm: number;
  costPerKm: number;
  totalKm: number;
}

export function KpiIndicators({ revenuePerKm, costPerKm, totalKm }: KpiIndicatorsProps) {
  const colors = useThemeColors();

  if (totalKm === 0) return null;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>R$/km</Text>
        <Text style={[styles.value, { color: colors.positive }]}>
          {formatCurrency(revenuePerKm)}
        </Text>
      </Card>
      <Card style={styles.card}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Custo/km</Text>
        <Text style={[styles.value, { color: colors.negative }]}>
          {formatCurrency(costPerKm)}
        </Text>
      </Card>
      <Card style={styles.card}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>km total</Text>
        <Text style={[styles.value, { color: colors.text }]}>{totalKm}</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  card: { flex: 1, alignItems: 'center' },
  label: { fontSize: fontSize.xs, marginBottom: spacing.xs },
  value: { fontSize: fontSize.md, fontWeight: '600' },
});
