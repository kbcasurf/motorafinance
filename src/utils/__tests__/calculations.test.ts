import {
  computeNetProfit,
  computeCostPerKm,
  computeRevenuePerKm,
  computeTotalKm,
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
});
