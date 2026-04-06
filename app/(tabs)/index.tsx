import { memo, useState, useEffect, Suspense, lazy, useMemo } from 'react';
import { useSettingsStore } from '../../src/stores/useSettingsStore';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useLiveIncomes } from '../../src/hooks/useLiveIncomes';
import { useLiveExpenses } from '../../src/hooks/useLiveExpenses';
import { useLiveExtras } from '../../src/hooks/useLiveExtras';
import { usePeriodFilter } from '../../src/hooks/usePeriodFilter';
import {
  computeNetProfit,
  computeTotalKm,
  computeCostPerKm,
  computeRevenuePerKm,
  computeFuelConsumption,
} from '../../src/utils/calculations';
import { PeriodSelector } from '../../src/components/dashboard/PeriodSelector';
import { SummaryCards } from '../../src/components/dashboard/SummaryCards';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';
import { Button } from '../../src/components/ui/Button';

const ProfitChart = lazy(() =>
  import('../../src/components/charts/ProfitChart').then((m) => ({ default: m.ProfitChart }))
);
const ConsumptionChart = lazy(() =>
  import('../../src/components/charts/ConsumptionChart').then((m) => ({ default: m.ConsumptionChart }))
);
import { GoalProgress } from '../../src/components/dashboard/GoalProgress';
import {
  getDailyIncomeTotals,
  getDailyExpenseTotals,
} from '../../src/db/queries/reports';
import type { DailyAggregate } from '../../src/db/queries/reports';
import { useThemeColors, spacing, fontSize } from '../../src/theme';

export default function DashboardScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const period = usePeriodFilter();
  const { data: incomes, updatedAt: incomesUpdatedAt } = useLiveIncomes(period.startDate, period.endDate);
  const { data: expensesList, updatedAt: expensesUpdatedAt } = useLiveExpenses(period.startDate, period.endDate);
  const { data: extrasList } = useLiveExtras(period.startDate, period.endDate);

  const [incomeByDay, setIncomeByDay] = useState<DailyAggregate[]>([]);
  const [expensesByDay, setExpensesByDay] = useState<DailyAggregate[]>([]);
  const monthlyGoalStr = useSettingsStore((s) => s.monthlyGoal);
  const monthlyGoal = monthlyGoalStr ? parseInt(monthlyGoalStr, 10) : null;

  // Load chart aggregates and goal when period changes
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getDailyIncomeTotals(period.startDate, period.endDate),
      getDailyExpenseTotals(period.startDate, period.endDate),
    ]).then(([income, expenses]) => {
      if (!cancelled) {
        setIncomeByDay(income);
        setExpensesByDay(expenses);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [period.startDate, period.endDate, incomesUpdatedAt, expensesUpdatedAt]);

  const totalRevenue = useMemo(() => incomes.reduce((sum, r) => sum + r.amount, 0), [incomes]);
  const totalExpenses = useMemo(() => expensesList.reduce((sum, e) => sum + e.amount, 0), [expensesList]);
  const netProfit = useMemo(() => computeNetProfit(totalRevenue, totalExpenses), [totalRevenue, totalExpenses]);
  const totalKm = useMemo(() => computeTotalKm(incomes), [incomes]);
  const revenuePerKm = useMemo(() => computeRevenuePerKm(totalRevenue, totalKm), [totalRevenue, totalKm]);
  const costPerKm = useMemo(() => computeCostPerKm(totalExpenses, totalKm), [totalExpenses, totalKm]);

  const fuelConsumption = useMemo(() => computeFuelConsumption(incomes, extrasList, expensesList), [incomes, extrasList, expensesList]);

  const hasData = incomes.length > 0 || expensesList.length > 0;
  const showChart = period.periodType !== 'day' && hasData;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <PeriodSelector
        periodType={period.periodType}
        onChangePeriodType={period.setPeriodType}
        label={period.label}
        onPrevious={period.goPrevious}
        onNext={period.goNext}
      />

      {!hasData ? (
        <View style={styles.empty}>
          <Feather name="bar-chart-2" size={48} color={colors.icon} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Nenhum dado para este periodo
          </Text>
          <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>
            Registre receitas e despesas para ver seu resumo financeiro
          </Text>
          <View style={styles.emptyActions}>
            <Button title="Registrar Receita" onPress={() => router.push('/(income)/new')} />
          </View>
        </View>
      ) : (
        <>
          <SummaryCards
            totalRevenue={totalRevenue}
            totalExpenses={totalExpenses}
            netProfit={netProfit}
            revenuePerKm={revenuePerKm}
            costPerKm={costPerKm}
            totalKm={totalKm}
          />

          {showChart && (
            <ErrorBoundary silent>
              <Suspense fallback={null}>
                <ProfitChart incomeByDay={incomeByDay} expensesByDay={expensesByDay} />
              </Suspense>
            </ErrorBoundary>
          )}

          {(fuelConsumption.urbanKmL !== null || fuelConsumption.highwayKmL !== null) && (
            <ErrorBoundary silent>
              <Suspense fallback={null}>
                <ConsumptionChart
                  urbanKmL={fuelConsumption.urbanKmL}
                  highwayKmL={fuelConsumption.highwayKmL}
                />
              </Suspense>
            </ErrorBoundary>
          )}

          {period.periodType === 'month' && (
            <GoalProgress netProfit={netProfit} goalCents={monthlyGoal} />
          )}
        </>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { alignItems: 'center', marginTop: spacing.xxl, padding: spacing.lg, gap: spacing.sm },
  emptyText: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  emptyHint: { fontSize: 14, textAlign: 'center' },
  emptyActions: { marginTop: spacing.lg },
  bottomSpacer: { height: spacing.xxl },
});
