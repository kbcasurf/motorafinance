import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { db } from '../db/client';
import { customCategories } from '../db/schema';

export function useLiveCustomCategories() {
  return useLiveQuery(db.select().from(customCategories).orderBy(customCategories.name));
}
