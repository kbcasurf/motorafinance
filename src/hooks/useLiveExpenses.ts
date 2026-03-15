import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { desc, between } from 'drizzle-orm';
import { db } from '../db/client';
import { expenses } from '../db/schema';

export function useLiveExpenses(startDate: string, endDate: string) {
  return useLiveQuery(
    db
      .select()
      .from(expenses)
      .where(between(expenses.date, startDate, endDate))
      .orderBy(desc(expenses.date)),
    [startDate, endDate],
  );
}
