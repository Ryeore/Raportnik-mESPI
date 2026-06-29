import * as SQLite from "expo-sqlite";

let dbInstance: SQLite.SQLiteDatabase | null = null;

/** Lazily opens (and caches) the SQLite database. */
export function getDb(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    dbInstance = SQLite.openDatabaseSync("raportnik.db");
  }
  return dbInstance;
}

/** Creates tables and indexes. Safe to call on every app start. */
export function initDatabase(): void {
  const db = getDb();
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY NOT NULL,
      ticker TEXT NOT NULL,
      company_name TEXT NOT NULL,
      report_number TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      publish_date TEXT NOT NULL,
      source_url TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS watched_companies (
      ticker TEXT PRIMARY KEY NOT NULL,
      company_name TEXT NOT NULL,
      added_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_reports_ticker ON reports (ticker);
    CREATE INDEX IF NOT EXISTS idx_reports_publish_date ON reports (publish_date);
  `);
}
