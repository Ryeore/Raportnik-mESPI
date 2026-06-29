import { fetchLatest } from './papSource';
import { pruneOld, upsertReports } from './repository';
import { RETENTION_MS } from './types';

/**
 * Pull the latest reports from PAP, store them deduped in SQLite, and prune
 * anything older than the retention window. Network failures are swallowed so
 * the cached feed remains usable offline.
 */
export async function syncReports(): Promise<void> {
  const since = new Date(Date.now() - RETENTION_MS);
  const latest = await fetchLatest(since);
  await upsertReports(latest);
  await pruneOld();
}
