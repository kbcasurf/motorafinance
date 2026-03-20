import { eq, desc, between } from 'drizzle-orm';
import * as Crypto from 'expo-crypto';
import { db } from '../client';
import { income } from '../schema';

export type Income = typeof income.$inferSelect;
export type NewIncome = Omit<typeof income.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>;

export async function insertIncome(data: NewIncome): Promise<void> {
  const now = new Date().toISOString();
  await db.insert(income).values({
    id: Crypto.randomUUID(),
    ...data,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateIncome(
  id: string,
  data: Partial<NewIncome>,
): Promise<void> {
  await db
    .update(income)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(income.id, id));
}

export async function deleteIncome(id: string): Promise<void> {
  await db.delete(income).where(eq(income.id, id));
}

export async function getIncomeById(id: string): Promise<Income | undefined> {
  const rows = await db.select().from(income).where(eq(income.id, id)).limit(1);
  return rows[0];
}

export async function getIncomeByDate(date: string): Promise<Income | undefined> {
  const rows = await db.select().from(income).where(eq(income.date, date)).limit(1);
  return rows[0];
}

export async function getLastIncome(): Promise<Income | undefined> {
  const rows = await db
    .select()
    .from(income)
    .orderBy(desc(income.createdAt))
    .limit(1);
  return rows[0];
}
