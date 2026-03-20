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

export interface ConsumptionSettings {
  tankCapacityMl: string;
  consumptionEthanolUrban: string;
  consumptionEthanolHighway: string;
  consumptionGasolineUrban: string;
  consumptionGasolineHighway: string;
}

// Returns km/L rate as a number, or null if not configured
export function getKmLRate(
  fuelType: 'ethanol' | 'gasoline',
  routeType: 'urban' | 'highway',
  settings: ConsumptionSettings,
): number | null {
  const keyMap = {
    ethanol: { urban: 'consumptionEthanolUrban', highway: 'consumptionEthanolHighway' },
    gasoline: { urban: 'consumptionGasolineUrban', highway: 'consumptionGasolineHighway' },
  } as const;
  const raw = settings[keyMap[fuelType][routeType]];
  if (!raw) return null;
  return parseInt(raw, 10) / 10;
}

export interface AttributionParams {
  fuelExpensesCents: number;
  professionalKm: { urban: number; highway: number };
  extrasKm: number;
}

export function computeProfessionalKm(
  incomes: Array<{ odoStart: number | null; odoEnd: number | null }>,
): number {
  return incomes.reduce((sum, row) => {
    if (row.odoStart != null && row.odoEnd != null) {
      return sum + Math.max(0, row.odoEnd - row.odoStart);
    }
    return sum;
  }, 0);
}

export function computeProfessionalKmByRouteType(
  incomes: Array<{ odoStart: number | null; odoEnd: number | null; routeType: string }>,
): { urban: number; highway: number } {
  return incomes.reduce(
    (acc, row) => {
      if (row.odoStart != null && row.odoEnd != null) {
        const km = Math.max(0, row.odoEnd - row.odoStart);
        if (row.routeType === 'highway') {
          return { ...acc, highway: acc.highway + km };
        }
        return { ...acc, urban: acc.urban + km };
      }
      return acc;
    },
    { urban: 0, highway: 0 },
  );
}

export function computeNetProfitWithAttribution(
  totalRevenueCents: number,
  nonFuelExpensesCents: number,
  fuelExpensesCents: number,
  professionalKm: number,
  extrasKm: number,
): number {
  const totalKm = professionalKm + extrasKm;
  const ratio = totalKm === 0 ? 1 : professionalKm / totalKm;
  const attributableFuel = Math.round(fuelExpensesCents * ratio);
  return totalRevenueCents - attributableFuel - nonFuelExpensesCents;
}

// Fuel cost attributable to professional work.
// Fallback: if total_km = 0, returns fuelExpensesCents in full.
export function computeAttributableFuelCost(params: AttributionParams): number {
  const { fuelExpensesCents, professionalKm, extrasKm } = params;
  const profKm = professionalKm.urban + professionalKm.highway;
  const totalKm = profKm + extrasKm;
  if (totalKm === 0) return fuelExpensesCents;
  const ratio = profKm / totalKm;
  return Math.round(fuelExpensesCents * ratio);
}
