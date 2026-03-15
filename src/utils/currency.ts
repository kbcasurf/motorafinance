const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrency(cents: number): string {
  return formatter.format(cents / 100);
}

export function parseCurrencyToCents(value: string): number {
  if (!value || value.trim() === '') return 0;
  const parsed = parseFloat(value.replace(',', '.'));
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

export function centsToDecimal(cents: number): number {
  return cents / 100;
}
