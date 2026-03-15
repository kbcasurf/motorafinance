// src/components/dashboard/SummaryCards.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/currency';
import { useThemeColors, spacing, fontSize } from '../../theme';

interface SummaryCardsProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

export function SummaryCards({ totalRevenue, totalExpenses, netProfit }: SummaryCardsProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Receita bruta</Text>
        <Text style={[styles.cardValue, { color: colors.positive }]}>
          {formatCurrency(totalRevenue)}
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Despesas</Text>
        <Text style={[styles.cardValue, { color: colors.negative }]}>
          {formatCurrency(totalExpenses)}
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Lucro liquido</Text>
        <Text
          style={[
            styles.cardValue,
            { color: netProfit >= 0 ? colors.positive : colors.negative },
          ]}
        >
          {formatCurrency(netProfit)}
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  card: { flex: 1, alignItems: 'center' },
  cardLabel: { fontSize: fontSize.xs, marginBottom: spacing.xs },
  cardValue: { fontSize: fontSize.md, fontWeight: 'bold' },
});
