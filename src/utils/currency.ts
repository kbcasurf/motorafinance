const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrency(cents: number): string {
  return formatter.format(cents / 100);
}

export function parseCurrencyToCents(value: string): number {
  if (!value || value.trim() === '') return 0;
  // Strip currency symbols and whitespace
  const cleaned = value.replace(/[R$\s]/g, '');
  // Reject any characters that aren't digits, dots, or commas
  if (!/^[0-9.,]+$/.test(cleaned)) return 0;

  // Determine decimal separator: comma = BRL, dot = US
  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');

  let normalized: string;
  if (lastComma > lastDot) {
    // BRL format (comma is decimal separator): remove thousands dots, replace comma with dot
    normalized = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (lastDot > lastComma) {
    // US format (dot is decimal separator): remove thousands commas, keep dot as decimal
    normalized = cleaned.replace(/,/g, '');
  } else {
    // No decimal separator — plain integer
    normalized = cleaned.replace(/[.,]/g, '');
  }

  const parsed = parseFloat(normalized);
  if (isNaN(parsed) || parsed < 0) return 0;
  return Math.round(parsed * 100);
}

export function centsToDecimal(cents: number): number {
  return cents / 100;
}
