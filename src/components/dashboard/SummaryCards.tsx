// src/components/dashboard/SummaryCards.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/currency';
import { useThemeColors, spacing, fontSize } from '../../theme';

interface SummaryCardsProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  revenuePerKm: number;
  costPerKm: number;
  totalKm: number;
}

export function SummaryCards({
  totalRevenue,
  totalExpenses,
  netProfit,
  revenuePerKm,
  costPerKm,
  totalKm,
}: SummaryCardsProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      {/* Line 1 */}
      <Card style={styles.card}>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Receita bruta</Text>
        <Text style={[styles.cardValue, { color: colors.positive }]}>
          {formatCurrency(totalRevenue)}
        </Text>
      </Card>
      <Card style={styles.card}>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>R$/km</Text>
        <Text style={[styles.cardValue, { color: colors.positive }]}>
          {formatCurrency(revenuePerKm)}
        </Text>
      </Card>

      {/* Line 2 */}
      <Card style={styles.card}>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Despesas</Text>
        <Text style={[styles.cardValue, { color: colors.negative }]}>
          {formatCurrency(totalExpenses)}
        </Text>
      </Card>
      <Card style={styles.card}>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Custo/km</Text>
        <Text style={[styles.cardValue, { color: colors.negative }]}>
          {formatCurrency(costPerKm)}
        </Text>
      </Card>

      {/* Line 3 */}
      <Card style={styles.card}>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Lucro líquido</Text>
        <Text
          style={[
            styles.cardValue,
            { color: netProfit >= 0 ? colors.positive : colors.negative },
          ]}
        >
          {formatCurrency(netProfit)}
        </Text>
      </Card>
      <Card style={styles.card}>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>km total</Text>
        <Text style={[styles.cardValue, { color: colors.text }]}>{totalKm}</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  card: { width: '48%', alignItems: 'center' },
  cardLabel: { fontSize: fontSize.xs, marginBottom: spacing.xs },
  cardValue: { fontSize: fontSize.md, fontWeight: 'bold' },
});
