import { sql, between, eq } from 'drizzle-orm';
import { db } from '../client';
import { income, expenses, settings, extras } from '../schema';

export interface DailyAggregate {
  date: string;
  total: number;
}

export async function getDailyIncomeTotals(
  startDate: string,
  endDate: string,
): Promise<DailyAggregate[]> {
  const rows = await db
    .select({
      date: income.date,
      total: sql<number>`sum(${income.amount})`.as('total'),
    })
    .from(income)
    .where(between(income.date, startDate, endDate))
    .groupBy(income.date)
    .orderBy(income.date);

  return rows.map((r) => ({ date: r.date, total: r.total ?? 0 }));
}

export async function getDailyExpenseTotals(
  startDate: string,
  endDate: string,
): Promise<DailyAggregate[]> {
  const rows = await db
    .select({
      date: expenses.date,
      total: sql<number>`sum(${expenses.amount})`.as('total'),
    })
    .from(expenses)
    .where(between(expenses.date, startDate, endDate))
    .groupBy(expenses.date)
    .orderBy(expenses.date);

  return rows.map((r) => ({ date: r.date, total: r.total ?? 0 }));
}

export async function getSettingValue(key: string): Promise<string | null> {
  const rows = await db
    .select()
    .from(settings)
    .where(eq(settings.key, key))
    .limit(1);
  return rows[0]?.value ?? null;
}

export async function getExtraKmForPeriod(
  startDate: string,
  endDate: string,
): Promise<number> {
  const rows = await db
    .select({
      total: sql<number>`sum(${extras.odoEnd} - ${extras.odoStart})`.as('total'),
    })
    .from(extras)
    .where(between(extras.date, startDate, endDate));
  return rows[0]?.total ?? 0;
}
