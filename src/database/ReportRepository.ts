import { getDb } from "./db";
import { EspiReport, SortOrder } from "@/types";
import { retentionCutoffIso } from "@/utils/date";

interface ReportRow {
  id: string;
  ticker: string;
  company_name: string;
  report_number: string;
  title: string;
  content: string;
  publish_date: string;
  source_url: string;
}

function toReport(r: ReportRow): EspiReport {
  return {
    id: r.id,
    ticker: r.ticker,
    companyName: r.company_name,
    reportNumber: r.report_number,
    title: r.title,
    content: r.content,
    publishDate: r.publish_date,
    url: r.source_url
  };
}

export const ReportRepository = {
  /** Inserts reports, ignoring duplicates by id. Returns ids that were new. */
  upsertMany(reports: EspiReport[]): string[] {
    const db = getDb();
    const newIds: string[] = [];
    db.withTransactionSync(() => {
      const stmt = db.prepareSync(
        `INSERT OR IGNORE INTO reports
          (id, ticker, company_name, report_number, title, content, publish_date, source_url, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );
      try {
        for (const r of reports) {
          const res = stmt.executeSync([
            r.id, r.ticker, r.companyName, r.reportNumber, r.title,
            r.content, r.publishDate, r.url, new Date().toISOString()
          ]);
          if (res.changes > 0) newIds.push(r.id);
        }
      } finally {
        stmt.finalizeSync();
      }
    });
    return newIds;
  },

  list(limit: number, offset: number): EspiReport[] {
    const rows = getDb().getAllSync<ReportRow>(
      `SELECT * FROM reports ORDER BY publish_date DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows.map(toReport);
  },

  listWatched(order: SortOrder, limit: number, offset: number): EspiReport[] {
    const dir = order === "newest" ? "DESC" : "ASC";
    const rows = getDb().getAllSync<ReportRow>(
      `SELECT r.* FROM reports r
       JOIN watched_companies w ON w.ticker = r.ticker
       ORDER BY r.publish_date ${dir} LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows.map(toReport);
  },

  search(query: string, limit: number, offset: number): EspiReport[] {
    const q = `%${query}%`;
    const rows = getDb().getAllSync<ReportRow>(
      `SELECT * FROM reports
       WHERE ticker LIKE ? OR company_name LIKE ? OR title LIKE ?
       ORDER BY publish_date DESC LIMIT ? OFFSET ?`,
      [q, q, q, limit, offset]
    );
    return rows.map(toReport);
  },

  getById(id: string): EspiReport | null {
    const row = getDb().getFirstSync<ReportRow>(`SELECT * FROM reports WHERE id = ?`, [id]);
    return row ? toReport(row) : null;
  },

  prune(): number {
    const res = getDb().runSync(`DELETE FROM reports WHERE publish_date < ?`, [retentionCutoffIso()]);
    return res.changes;
  },

  clear(): void {
    getDb().runSync(`DELETE FROM reports`);
  }
};
