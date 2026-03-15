import { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useLiveIncomes } from '../../src/hooks/useLiveIncomes';
import { useLiveExpenses } from '../../src/hooks/useLiveExpenses';
import { usePeriodFilter } from '../../src/hooks/usePeriodFilter';
import {
  computeNetProfit,
  computeTotalKm,
  computeCostPerKm,
  computeRevenuePerKm,
} from '../../src/utils/calculations';
import { PeriodSelector } from '../../src/components/dashboard/PeriodSelector';
import { SummaryCards } from '../../src/components/dashboard/SummaryCards';
import { KpiIndicators } from '../../src/components/dashboard/KpiIndicators';
import { ProfitChart } from '../../src/components/charts/ProfitChart';
import { GoalProgress } from '../../src/components/dashboard/GoalProgress';
import {
  getDailyIncomeTotals,
  getDailyExpenseTotals,
  getSettingValue,
} from '../../src/db/queries/reports';
import type { DailyAggregate } from '../../src/db/queries/reports';
import { useThemeColors, spacing, fontSize } from '../../src/theme';

export default function DashboardScreen() {
  const colors = useThemeColors();
  const period = usePeriodFilter();
  const { data: incomes } = useLiveIncomes(period.startDate, period.endDate);
  const { data: expensesList } = useLiveExpenses(period.startDate, period.endDate);

  const [incomeByDay, setIncomeByDay] = useState<DailyAggregate[]>([]);
  const [expensesByDay, setExpensesByDay] = useState<DailyAggregate[]>([]);
  const [monthlyGoal, setMonthlyGoal] = useState<number | null>(null);

  // Load chart aggregates and goal when period changes
  useEffect(() => {
    getDailyIncomeTotals(period.startDate, period.endDate).then(setIncomeByDay);
    getDailyExpenseTotals(period.startDate, period.endDate).then(setExpensesByDay);
  }, [period.startDate, period.endDate, incomes, expensesList]);

  useEffect(() => {
    getSettingValue('monthly_goal').then((val) => {
      setMonthlyGoal(val ? parseInt(val, 10) : null);
    });
  }, []);

  const totalRevenue = incomes.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = expensesList.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = computeNetProfit(totalRevenue, totalExpenses);
  const totalKm = computeTotalKm(incomes);
  const revenuePerKm = computeRevenuePerKm(totalRevenue, totalKm);
  const costPerKm = computeCostPerKm(totalExpenses, totalKm);

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
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Nenhum dado para este periodo.
          </Text>
          <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>
            Registre receitas e despesas para ver o resumo.
          </Text>
        </View>
      ) : (
        <>
          <SummaryCards
            totalRevenue={totalRevenue}
            totalExpenses={totalExpenses}
            netProfit={netProfit}
          />

          <KpiIndicators
            revenuePerKm={revenuePerKm}
            costPerKm={costPerKm}
            totalKm={totalKm}
          />

          {showChart && (
            <ProfitChart incomeByDay={incomeByDay} expensesByDay={expensesByDay} />
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
  empty: { alignItems: 'center', marginTop: spacing.xxl, padding: spacing.lg },
  emptyText: { fontSize: fontSize.md, textAlign: 'center' },
  emptyHint: { fontSize: fontSize.sm, textAlign: 'center', marginTop: spacing.sm },
  bottomSpacer: { height: spacing.xxl },
});
