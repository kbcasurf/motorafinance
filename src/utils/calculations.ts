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

export interface FuelConsumptionResult {
  urbanKmL: number | null;
  highwayKmL: number | null;
}

export function computeFuelConsumption(
  incomes: Array<{ odoStart: number | null; odoEnd: number | null; routeType: string }>,
  extrasArr: Array<{ odoStart: number; odoEnd: number; routeType: string }>,
  expensesArr: Array<{ fuelLiters: number | null }>,
): FuelConsumptionResult {
  const incomeKm = computeProfessionalKmByRouteType(incomes);

  const extrasKm = extrasArr.reduce(
    (acc, row) => {
      const km = Math.max(0, row.odoEnd - row.odoStart);
      if (row.routeType === 'highway') return { ...acc, highway: acc.highway + km };
      return { ...acc, urban: acc.urban + km };
    },
    { urban: 0, highway: 0 },
  );

  const urbanKm = incomeKm.urban + extrasKm.urban;
  const highwayKm = incomeKm.highway + extrasKm.highway;
  const totalKm = urbanKm + highwayKm;

  const totalLiters = expensesArr.reduce((sum, e) => sum + (e.fuelLiters ?? 0), 0) / 1000;

  if (totalLiters === 0 || totalKm === 0) return { urbanKmL: null, highwayKmL: null };

  const urbanFuel = totalLiters * (urbanKm / totalKm);
  const highwayFuel = totalLiters * (highwayKm / totalKm);

  return {
    urbanKmL: urbanKm > 0 && urbanFuel > 0 ? urbanKm / urbanFuel : null,
    highwayKmL: highwayKm > 0 && highwayFuel > 0 ? highwayKm / highwayFuel : null,
  };
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
