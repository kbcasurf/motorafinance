// src/components/dashboard/GoalProgress.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/currency';
import { useThemeColors, spacing, typography } from '../../theme';

interface GoalProgressProps {
  netProfit: number;
  goalCents: number | null;
}

export function GoalProgress({ netProfit, goalCents }: GoalProgressProps) {
  const colors = useThemeColors();

  if (goalCents == null || goalCents <= 0) return null;

  const percentage = Math.min(Math.max((netProfit / goalCents) * 100, 0), 100);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={[styles.title, { color: colors.textSecondary }]}>Meta mensal</Text>
        <View style={styles.row}>
          <Text style={[styles.current, { color: colors.text }]}>
            {formatCurrency(Math.max(netProfit, 0))}
          </Text>
          <Text style={[styles.goal, { color: colors.textSecondary }]}>
            / {formatCurrency(goalCents)}
          </Text>
        </View>
        <View style={[styles.trackOuter, { backgroundColor: colors.surfaceSecondary }]}>
          <View
            style={[
              styles.trackInner,
              {
                backgroundColor: netProfit >= goalCents ? colors.positive : colors.primary,
                width: `${percentage}%`,
              },
            ]}
          />
        </View>
        <Text style={[styles.percentage, { color: colors.textSecondary }]}>
          {percentage.toFixed(0)}%
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  card: { paddingVertical: spacing.md },
  title: { ...typography.caption, fontWeight: '600', marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'baseline', marginBottom: spacing.sm },
  current: { ...typography.h2, fontWeight: '700' },
  goal: { ...typography.caption, marginLeft: spacing.xs },
  trackOuter: {
    height: 8,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  trackInner: {
    height: '100%',
    borderRadius: 9999,
  },
  percentage: { ...typography.caption, textAlign: 'right', marginTop: spacing.xs },
});
