import { eq } from 'drizzle-orm';
import { db } from '../client';
import { customCategories } from '../schema';

export type CustomCategory = typeof customCategories.$inferSelect;

export async function insertCustomCategory(name: string): Promise<void> {
  await db.insert(customCategories).values({
    id: crypto.randomUUID(),
    name,
  });
}

export async function deleteCustomCategory(id: string): Promise<void> {
  await db.delete(customCategories).where(eq(customCategories.id, id));
}

export async function getAllCustomCategories(): Promise<CustomCategory[]> {
  return db.select().from(customCategories).orderBy(customCategories.name);
}
