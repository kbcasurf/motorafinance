import {
  computeNetProfit,
  computeCostPerKm,
  computeRevenuePerKm,
  computeTotalKm,
  getKmLRate,
  computeProfessionalKmByRouteType,
  computeFuelConsumption,
  computeNetProfitWithAttribution,
  computeAttributableFuelCost,
} from '../calculations';

describe('calculations', () => {
  describe('computeNetProfit', () => {
    it('subtracts expenses from revenue', () => {
      expect(computeNetProfit(10000, 3500)).toBe(6500);
    });

    it('returns negative when expenses exceed revenue', () => {
      expect(computeNetProfit(2000, 5000)).toBe(-3000);
    });

    it('handles zeros', () => {
      expect(computeNetProfit(0, 0)).toBe(0);
    });
  });

  describe('computeTotalKm', () => {
    it('sums km driven from income entries', () => {
      const incomes = [
        { odoStart: 1000, odoEnd: 1050 },
        { odoStart: 1050, odoEnd: 1120 },
        { odoStart: null, odoEnd: null },
      ];
      expect(computeTotalKm(incomes)).toBe(120);
    });

    it('returns 0 when no odometer data', () => {
      const incomes = [{ odoStart: null, odoEnd: null }];
      expect(computeTotalKm(incomes)).toBe(0);
    });

    it('ignores entries where odoEnd is less than odoStart', () => {
      const incomes = [{ odoStart: 1100, odoEnd: 1000 }];
      expect(computeTotalKm(incomes)).toBe(0);
    });
  });

  describe('computeCostPerKm', () => {
    it('divides total expenses by total km', () => {
      expect(computeCostPerKm(12000, 100)).toBe(120);
    });

    it('returns 0 when km is 0', () => {
      expect(computeCostPerKm(12000, 0)).toBe(0);
    });
  });

  describe('computeRevenuePerKm', () => {
    it('divides total revenue by total km', () => {
      expect(computeRevenuePerKm(25000, 100)).toBe(250);
    });

    it('returns 0 when km is 0', () => {
      expect(computeRevenuePerKm(25000, 0)).toBe(0);
    });
  });

  describe('getKmLRate', () => {
    const settings = {
      tankCapacityMl: '50000',
      consumptionEthanolUrban: '80',
      consumptionEthanolHighway: '100',
      consumptionGasolineUrban: '110',
      consumptionGasolineHighway: '130',
    };

    it('returns ethanol urban rate', () => {
      expect(getKmLRate('ethanol', 'urban', settings)).toBe(8);
    });

    it('returns ethanol highway rate', () => {
      expect(getKmLRate('ethanol', 'highway', settings)).toBe(10);
    });

    it('returns gasoline urban rate', () => {
      expect(getKmLRate('gasoline', 'urban', settings)).toBe(11);
    });

    it('returns gasoline highway rate', () => {
      expect(getKmLRate('gasoline', 'highway', settings)).toBe(13);
    });

    it('returns null when setting is empty string', () => {
      const emptySettings = {
        tankCapacityMl: '',
        consumptionEthanolUrban: '',
        consumptionEthanolHighway: '',
        consumptionGasolineUrban: '',
        consumptionGasolineHighway: '',
      };
      expect(getKmLRate('ethanol', 'urban', emptySettings)).toBeNull();
    });
  });

  describe('computeProfessionalKmByRouteType', () => {
    it('sums km separated by route type', () => {
      const incomes = [
        { odoStart: 1000, odoEnd: 1050, routeType: 'urban' },
        { odoStart: 1050, odoEnd: 1150, routeType: 'highway' },
        { odoStart: 1150, odoEnd: 1180, routeType: 'urban' },
      ];
      const result = computeProfessionalKmByRouteType(incomes);
      expect(result).toEqual({ urban: 80, highway: 100 });
    });

    it('ignores entries with null odometer', () => {
      const incomes = [
        { odoStart: null, odoEnd: null, routeType: 'urban' },
      ];
      const result = computeProfessionalKmByRouteType(incomes);
      expect(result).toEqual({ urban: 0, highway: 0 });
    });

    it('defaults to urban for unknown route type', () => {
      const incomes = [
        { odoStart: 1000, odoEnd: 1030, routeType: 'unknown' },
      ];
      const result = computeProfessionalKmByRouteType(incomes);
      expect(result).toEqual({ urban: 30, highway: 0 });
    });

    it('ignores backward odometer readings', () => {
      const incomes = [
        { odoStart: 1100, odoEnd: 1000, routeType: 'urban' },
      ];
      const result = computeProfessionalKmByRouteType(incomes);
      expect(result).toEqual({ urban: 0, highway: 0 });
    });
  });

  describe('computeFuelConsumption', () => {
    it('calculates urban and highway km/L rates', () => {
      const incomes = [
        { odoStart: 1000, odoEnd: 1050, routeType: 'urban' },
        { odoStart: 1050, odoEnd: 1150, routeType: 'highway' },
      ];
      const extras = [] as Array<{ odoStart: number; odoEnd: number; routeType: string }>;
      const expenses = [{ fuelLiters: 10000 }]; // 10 litros (stored in cl?)

      const result = computeFuelConsumption(incomes, extras, expenses);

      expect(result.urbanKmL).not.toBeNull();
      expect(result.highwayKmL).not.toBeNull();
    });

    it('returns null when no fuel liters data', () => {
      const incomes = [
        { odoStart: 1000, odoEnd: 1050, routeType: 'urban' },
      ];
      const extras = [] as Array<{ odoStart: number; odoEnd: number; routeType: string }>;
      const expenses = [{ fuelLiters: null }];

      const result = computeFuelConsumption(incomes, extras, expenses);
      expect(result).toEqual({ urbanKmL: null, highwayKmL: null });
    });

    it('returns null when no km driven', () => {
      const incomes = [
        { odoStart: null, odoEnd: null, routeType: 'urban' },
      ];
      const extras = [] as Array<{ odoStart: number; odoEnd: number; routeType: string }>;
      const expenses = [{ fuelLiters: 10000 }];

      const result = computeFuelConsumption(incomes, extras, expenses);
      expect(result).toEqual({ urbanKmL: null, highwayKmL: null });
    });

    it('combines extras km with income km', () => {
      const incomes = [
        { odoStart: 1000, odoEnd: 1050, routeType: 'urban' },
      ];
      const extras = [
        { odoStart: 1050, odoEnd: 1080, routeType: 'urban' },
        { odoStart: 1080, odoEnd: 1180, routeType: 'highway' },
      ];
      const expenses = [{ fuelLiters: 15000 }];

      const result = computeFuelConsumption(incomes, extras, expenses);

      // 50 urban + 80 urban + 100 highway = 230 total km
      // 15000 / 1000 = 15 total liters
      expect(result.urbanKmL).not.toBeNull();
      expect(result.highwayKmL).not.toBeNull();
    });
  });

  describe('computeNetProfitWithAttribution', () => {
    it('calculates profit with fuel attribution based on km ratio', () => {
      // Prof: 80km, Extras: 20km → ratio = 0.8
      // Attributable fuel: 10000 * 0.8 = 8000
      // Net: 50000 - 8000 - 5000 = 37000
      const result = computeNetProfitWithAttribution(
        50000, // totalRevenueCents
        5000, // nonFuelExpensesCents
        10000, // fuelExpensesCents
        80, // professionalKm
        20, // extrasKm
      );
      expect(result).toBe(37000);
    });

    it('returns full fuel cost when no km', () => {
      const result = computeNetProfitWithAttribution(
        50000,
        5000,
        10000,
        0,
        0,
      );
      // ratio = 1 (fallback), so net = 50000 - 10000 - 5000 = 35000
      expect(result).toBe(35000);
    });

    it('can be negative when expenses exceed revenue', () => {
      const result = computeNetProfitWithAttribution(
        5000,
        2000,
        10000,
        50,
        50,
      );
      // ratio = 0.5, attributable = 5000
      // net = 5000 - 5000 - 2000 = -2000
      expect(result).toBe(-2000);
    });
  });

  describe('computeAttributableFuelCost', () => {
    it('attributes fuel cost proportionally to professional km', () => {
      const params = {
        fuelExpensesCents: 10000,
        professionalKm: { urban: 40, highway: 60 },
        extrasKm: 50,
      };
      // profKm = 100, totalKm = 150, ratio = 100/150 = 0.6667
      // attributable = 10000 * 0.6667 = 6667
      expect(computeAttributableFuelCost(params)).toBe(6667);
    });

    it('returns full fuel cost when no km', () => {
      const params = {
        fuelExpensesCents: 10000,
        professionalKm: { urban: 0, highway: 0 },
        extrasKm: 0,
      };
      expect(computeAttributableFuelCost(params)).toBe(10000);
    });

    it('attributes nothing when only extras km', () => {
      const params = {
        fuelExpensesCents: 10000,
        professionalKm: { urban: 0, highway: 0 },
        extrasKm: 100,
      };
      // ratio = 0/100 = 0
      expect(computeAttributableFuelCost(params)).toBe(0);
    });
  });
});
