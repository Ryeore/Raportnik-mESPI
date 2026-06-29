import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Single shared connection. Schema is created idempotently on first open. */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('raportnik.db').then(async (db) => {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS reports (
          id           TEXT PRIMARY KEY NOT NULL,
          external_id  TEXT UNIQUE NOT NULL,
          company_id   TEXT NOT NULL,
          type         TEXT NOT NULL,
          number       TEXT NOT NULL,
          title        TEXT NOT NULL,
          body         TEXT NOT NULL,
          published_at INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_reports_published_at ON reports(published_at DESC);
      `);
      return db;
    });
  }
  return dbPromise;
}
