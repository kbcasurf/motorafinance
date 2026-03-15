import { db } from '../client';
import { income, expenses, customCategories, settings } from '../schema';

export async function wipeAllData(): Promise<void> {
  await db.delete(income);
  await db.delete(expenses);
  await db.delete(customCategories);
  await db.delete(settings);
}
