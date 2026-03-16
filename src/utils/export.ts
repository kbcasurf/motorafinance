import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

interface IncomeRow {
  date: string;
  amount: number;
  platform: string;
  platformCustom: string | null;
  odoStart: number | null;
  odoEnd: number | null;
  time: string | null;
}

interface ExpenseRow {
  date: string;
  amount: number;
  category: string;
  description: string | null;
  odoReading: number | null;
}

const CSV_HEADER =
  'Data,Tipo,Categoria/Plataforma,Valor (R$),Km Inicio,Km Fim,Km Percorrida,Descricao';

function escapeField(value: string | null | undefined): string {
  if (value == null) return '';
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildCsvContent(incomes: IncomeRow[], expenses: ExpenseRow[]): string {
  const lines: string[] = [CSV_HEADER];

  for (const r of incomes) {
    const kmDriven =
      r.odoStart != null && r.odoEnd != null ? (r.odoEnd - r.odoStart).toString() : '';
    lines.push(
      [
        r.date,
        'Receita',
        escapeField(r.platformCustom || r.platform),
        (r.amount / 100).toFixed(2),
        r.odoStart?.toString() ?? '',
        r.odoEnd?.toString() ?? '',
        kmDriven,
        escapeField(null),
      ].join(','),
    );
  }

  for (const e of expenses) {
    lines.push(
      [
        e.date,
        'Despesa',
        escapeField(e.category),
        (e.amount / 100).toFixed(2),
        '',
        '',
        e.odoReading?.toString() ?? '',
        escapeField(e.description),
      ].join(','),
    );
  }

  return lines.join('\n');
}

export async function exportAndShareCsv(
  incomes: IncomeRow[],
  expenses: ExpenseRow[],
  periodLabel: string,
): Promise<void> {
  const content = buildCsvContent(incomes, expenses);
  const fileName = `motorafinance-${periodLabel.replace(/\s+/g, '-')}.csv`;
  const filePath = `${FileSystem.cacheDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(filePath, content, {
    encoding: 'utf8',
  });

  await Sharing.shareAsync(filePath, {
    mimeType: 'text/csv',
    dialogTitle: 'Exportar dados',
    UTI: 'public.comma-separated-values-text',
  });
}
