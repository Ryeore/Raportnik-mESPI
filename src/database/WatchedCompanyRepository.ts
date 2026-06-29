import { getDb } from "./db";
import { WatchedCompany } from "@/types";

export const WatchedCompanyRepository = {
  list(): WatchedCompany[] {
    return getDb().getAllSync<{ ticker: string; company_name: string; added_at: string }>(
      `SELECT * FROM watched_companies ORDER BY added_at DESC`
    ).map((r) => ({ ticker: r.ticker, companyName: r.company_name, addedAt: r.added_at }));
  },

  tickers(): string[] {
    return getDb().getAllSync<{ ticker: string }>(`SELECT ticker FROM watched_companies`).map((r) => r.ticker);
  },

  add(ticker: string, companyName: string): void {
    getDb().runSync(
      `INSERT OR REPLACE INTO watched_companies (ticker, company_name, added_at) VALUES (?, ?, ?)`,
      [ticker, companyName, new Date().toISOString()]
    );
  },

  remove(ticker: string): void {
    getDb().runSync(`DELETE FROM watched_companies WHERE ticker = ?`, [ticker]);
  },

  isWatched(ticker: string): boolean {
    return !!getDb().getFirstSync(`SELECT 1 FROM watched_companies WHERE ticker = ?`, [ticker]);
  }
};
