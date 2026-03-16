import { eq, desc, between } from 'drizzle-orm';
import * as Crypto from 'expo-crypto';
import { db } from '../client';
import { expenses } from '../schema';

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = Omit<typeof expenses.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>;

export async function insertExpense(data: NewExpense): Promise<void> {
  const now = new Date().toISOString();
  await db.insert(expenses).values({
    id: Crypto.randomUUID(),
    ...data,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateExpense(
  id: string,
  data: Partial<NewExpense>,
): Promise<void> {
  await db
    .update(expenses)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(expenses.id, id));
}

export async function deleteExpense(id: string): Promise<void> {
  await db.delete(expenses).where(eq(expenses.id, id));
}

export async function getExpenseById(id: string): Promise<Expense | undefined> {
  const rows = await db.select().from(expenses).where(eq(expenses.id, id)).limit(1);
  return rows[0];
}
