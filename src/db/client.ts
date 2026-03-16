import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const expo = openDatabaseSync('motorafinance.db', {
  enableChangeListener: true,
});

export const db = drizzle(expo, { schema });
