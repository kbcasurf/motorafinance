import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/currency';
import { useThemeColors, spacing, typography } from '../../theme';

interface SummaryCardsProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  revenuePerKm: number;
  costPerKm: number;
  totalKm: number;
}

export const SummaryCards = memo(function SummaryCards({
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
      <View style={styles.cardPair}>
        <Card style={styles.card}>
          <Text
            style={[styles.caption, { color: colors.textSecondary }]}
            numberOfLines={1}
            ellipsizeMode="tail">
            Receita bruta
          </Text>
          <Text
            style={[styles.value, { color: colors.positive }]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {formatCurrency(totalRevenue)}
          </Text>
        </Card>
        <Card style={styles.card}>
          <Text
            style={[styles.caption, { color: colors.textSecondary }]}
            numberOfLines={1}>
            R$/km
          </Text>
          <Text
            style={[styles.value, { color: colors.positive }]}
            numberOfLines={1}>
            {formatCurrency(revenuePerKm)}
          </Text>
        </Card>
      </View>

      {/* Line 2 */}
      <View style={styles.cardPair}>
        <Card style={styles.card}>
          <Text
            style={[styles.caption, { color: colors.textSecondary }]}
            numberOfLines={1}>
            Despesas
          </Text>
          <Text
            style={[styles.value, { color: colors.negative }]}
            numberOfLines={1}>
            {formatCurrency(totalExpenses)}
          </Text>
        </Card>
        <Card style={styles.card}>
          <Text
            style={[styles.caption, { color: colors.textSecondary }]}
            numberOfLines={1}>
            Custo/km
          </Text>
          <Text
            style={[styles.value, { color: colors.negative }]}
            numberOfLines={1}>
            {formatCurrency(costPerKm)}
          </Text>
        </Card>
      </View>

      {/* Line 3 */}
      <View style={styles.cardPair}>
        <Card style={styles.card}>
          <Text
            style={[styles.caption, { color: colors.textSecondary }]}
            numberOfLines={1}>
            Lucro líquido
          </Text>
          <Text
            style={[
              styles.value,
              { color: netProfit >= 0 ? colors.positive : colors.negative },
            ]}
            numberOfLines={1}>
            {formatCurrency(netProfit)}
          </Text>
        </Card>
        <Card style={styles.card}>
          <Text
            style={[styles.caption, { color: colors.textSecondary }]}
            numberOfLines={1}>
            km total
          </Text>
          <Text
            style={[styles.value, { color: colors.text }]}
            numberOfLines={1}>
            {totalKm}
          </Text>
        </Card>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  cardPair: { flexDirection: 'row', gap: spacing.sm },
  card: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  caption: { ...typography.caption, marginBottom: spacing.xs },
  value: { ...typography.tabular, fontSize: typography.h3.fontSize, fontWeight: '700' },
});
