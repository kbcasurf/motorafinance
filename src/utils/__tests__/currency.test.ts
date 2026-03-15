import { formatCurrency, parseCurrencyToCents, centsToDecimal } from '../currency';

describe('currency utils', () => {
  describe('formatCurrency', () => {
    it('formats centavos to BRL string', () => {
      expect(formatCurrency(2550)).toBe('R$\u00a025,50');
    });

    it('formats zero', () => {
      expect(formatCurrency(0)).toBe('R$\u00a00,00');
    });

    it('formats large values', () => {
      expect(formatCurrency(1500000)).toBe('R$\u00a015.000,00');
    });
  });

  describe('parseCurrencyToCents', () => {
    it('parses decimal string to centavos', () => {
      expect(parseCurrencyToCents('25.50')).toBe(2550);
    });

    it('parses integer string', () => {
      expect(parseCurrencyToCents('100')).toBe(10000);
    });

    it('returns 0 for empty string', () => {
      expect(parseCurrencyToCents('')).toBe(0);
    });

    it('returns 0 for invalid input', () => {
      expect(parseCurrencyToCents('abc')).toBe(0);
    });
  });

  describe('centsToDecimal', () => {
    it('converts centavos to decimal number', () => {
      expect(centsToDecimal(2550)).toBe(25.5);
    });

    it('converts zero', () => {
      expect(centsToDecimal(0)).toBe(0);
    });
  });
});
