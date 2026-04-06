import { eq } from 'drizzle-orm';
import * as Crypto from 'expo-crypto';
import { db } from '../client';
import { extras } from '../schema';

export type Extra = typeof extras.$inferSelect;
export type NewExtra = Omit<typeof extras.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>;

export async function insertExtra(data: NewExtra): Promise<void> {
  const now = new Date().toISOString();
  try {
    await db.insert(extras).values({
      id: Crypto.randomUUID(),
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  } catch (err) {
    throw new Error(`insertExtra failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function updateExtra(id: string, data: Partial<NewExtra>): Promise<void> {
  try {
    await db
      .update(extras)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(extras.id, id));
  } catch (err) {
    throw new Error(`updateExtra failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function deleteExtra(id: string): Promise<void> {
  try {
    await db.delete(extras).where(eq(extras.id, id));
  } catch (err) {
    throw new Error(`deleteExtra failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function getExtraById(id: string): Promise<Extra | undefined> {
  const rows = await db.select().from(extras).where(eq(extras.id, id)).limit(1);
  return rows[0];
}
