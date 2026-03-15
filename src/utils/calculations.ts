export function computeNetProfit(totalRevenue: number, totalExpenses: number): number {
  return totalRevenue - totalExpenses;
}

export function computeTotalKm(
  incomes: Array<{ odoStart: number | null; odoEnd: number | null }>,
): number {
  return incomes.reduce((sum, row) => {
    if (row.odoStart != null && row.odoEnd != null) {
      return sum + Math.max(0, row.odoEnd - row.odoStart);
    }
    return sum;
  }, 0);
}

export function computeCostPerKm(totalExpensesCents: number, totalKm: number): number {
  if (totalKm === 0) return 0;
  return Math.round(totalExpensesCents / totalKm);
}

export function computeRevenuePerKm(totalRevenueCents: number, totalKm: number): number {
  if (totalKm === 0) return 0;
  return Math.round(totalRevenueCents / totalKm);
}
