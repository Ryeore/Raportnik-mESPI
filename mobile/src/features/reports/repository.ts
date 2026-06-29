import { getDb } from '../../db/database';
import { Report, RETENTION_MS } from './types';

function toReport(row: any): Report {
  return {
    id: row.id,
    externalId: row.external_id,
    companyId: row.company_id,
    type: row.type,
    number: row.number,
    title: row.title,
    body: row.body,
    publishedAt: new Date(row.published_at).toISOString(),
  };
}

/** Insert reports, deduped by external_id. Idempotent. */
export async function upsertReports(reports: Report[]): Promise<void> {
  if (reports.length === 0) return;
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    for (const r of reports) {
      await db.runAsync(
        `INSERT OR IGNORE INTO reports
           (id, external_id, company_id, type, number, title, body, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        r.id,
        r.externalId,
        r.companyId,
        r.type,
        r.number,
        r.title,
        r.body,
        new Date(r.publishedAt).getTime(),
      );
    }
  });
}

/** Read newest-first, keyset-paginated by published_at. */
export async function queryReports(params: {
  type?: Report['type'];
  q?: string;
  cursor?: number;
  size?: number;
}): Promise<Report[]> {
  const db = await getDb();
  const size = params.size ?? 20;
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (params.cursor) {
    where.push('published_at < ?');
    args.push(params.cursor);
  }
  if (params.type) {
    where.push('type = ?');
    args.push(params.type);
  }
  if (params.q) {
    where.push('(title LIKE ? OR body LIKE ?)');
    args.push(`%${params.q}%`, `%${params.q}%`);
  }
  const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const rows = await db.getAllAsync<any>(
    `SELECT * FROM reports ${clause} ORDER BY published_at DESC LIMIT ?`,
    ...args,
    size,
  );
  return rows.map(toReport);
}

/** Drop reports older than the retention window (~1 month). */
export async function pruneOld(): Promise<void> {
  const db = await getDb();
  const cutoff = Date.now() - RETENTION_MS;
  await db.runAsync('DELETE FROM reports WHERE published_at < ?', cutoff);
}
