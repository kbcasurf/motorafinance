import { expoDb } from './client';

/**
 * At startup, verify that the actual SQLite schema matches expectations.
 * `useMigrations` can report success when the journal file claims migrations
 * ran but the underlying `.db` file is stale (e.g. from a previous build).
 * This function detects that mismatch and forces a fresh database.
 */
export async function validateSchema(): Promise<boolean> {
  try {
    // Income table should have time_start column
    const incomeColumns = await expoDb.getAllAsync<{ name: string }>(
      `PRAGMA table_info(income)`,
    );
    const incomeColNames = incomeColumns.map((c) => c.name);
    if (!incomeColNames.includes('time_start')) {
      return false;
    }
    if (!incomeColNames.includes('route_type')) {
      return false;
    }

    // Extras table must exist
    const extrasTable = await expoDb.getFirstAsync<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='extras'`,
    );
    if (!extrasTable) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Drop all tables and reset the migration journal so useMigrations runs
 * every migration from scratch on next mount.
 */
export async function resetDatabase(): Promise<void> {
  await expoDb.execAsync(`
    DROP TABLE IF EXISTS income;
    DROP TABLE IF EXISTS expenses;
    DROP TABLE IF EXISTS custom_categories;
    DROP TABLE IF EXISTS settings;
    DROP TABLE IF EXISTS extras;
    DROP TABLE IF EXISTS __drizzle_migrations;
  `);
}
