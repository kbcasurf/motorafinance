// src/components/charts/ProfitChart.tsx
import { View, Text, StyleSheet } from 'react-native';
import { CartesianChart, BarGroup } from 'victory-native';
import { useThemeColors, spacing, typography } from '../../theme';
import type { DailyAggregate } from '../../db/queries/reports';

interface ProfitChartProps {
  incomeByDay: DailyAggregate[];
  expensesByDay: DailyAggregate[];
}

interface ChartDatum extends Record<string, unknown> {
  day: string;
  revenue: number;
  expenses: number;
}

export function ProfitChart({ incomeByDay, expensesByDay }: ProfitChartProps) {
  const colors = useThemeColors();

  // Merge into single array keyed by date
  const dateSet = new Set([
    ...incomeByDay.map((d) => d.date),
    ...expensesByDay.map((d) => d.date),
  ]);

  const incomeMap = new Map(incomeByDay.map((d) => [d.date, d.total]));
  const expenseMap = new Map(expensesByDay.map((d) => [d.date, d.total]));

  const data: ChartDatum[] = Array.from(dateSet)
    .sort()
    .map((date) => {
      const [, month, day] = date.split('-');
      return {
      day: `${day}/${month}`, // DD/MM for x-axis labels
      revenue: (incomeMap.get(date) ?? 0) / 100,
      expenses: (expenseMap.get(date) ?? 0) / 100,
      };
    });

  if (data.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>
        Receita x Despesas
      </Text>
      <View style={styles.chartWrapper}>
        <CartesianChart
          data={data}
          xKey="day"
          yKeys={['revenue', 'expenses']}
          domain={{ y: [0] }}
          domainPadding={{ left: 30, right: 30, top: 20 }}
        >
          {({ points, chartBounds }) => (
            <BarGroup
              chartBounds={chartBounds}
              betweenGroupPadding={0.3}
              withinGroupPadding={0.1}
            >
              <BarGroup.Bar
                points={points.revenue}
                color={colors.positive}
                animate={{ type: 'timing' }}
              />
              <BarGroup.Bar
                points={points.expenses}
                color={colors.negative}
                animate={{ type: 'timing' }}
              />
            </BarGroup>
          )}
        </CartesianChart>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.positive }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Receita</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.negative }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Despesa</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  title: { ...typography.h3, marginBottom: spacing.md },
  chartWrapper: { height: 220 },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { ...typography.caption },
});
