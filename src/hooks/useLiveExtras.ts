import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { desc, between } from 'drizzle-orm';
import { db } from '../db/client';
import { extras } from '../db/schema';

export function useLiveExtras(startDate: string, endDate: string) {
  return useLiveQuery(
    db
      .select()
      .from(extras)
      .where(between(extras.date, startDate, endDate))
      .orderBy(desc(extras.date), desc(extras.timeStart)),
    [startDate, endDate],
  );
}
