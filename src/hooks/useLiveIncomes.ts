import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { desc, between } from 'drizzle-orm';
import { db } from '../db/client';
import { income } from '../db/schema';

export function useLiveIncomes(startDate: string, endDate: string) {
  return useLiveQuery(
    db
      .select()
      .from(income)
      .where(between(income.date, startDate, endDate))
      .orderBy(desc(income.date), desc(income.time)),
  );
}
