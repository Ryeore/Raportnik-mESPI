import { queryReports } from '../features/reports/repository';
import { syncReports } from '../features/reports/sync';
import { Report, ReportType } from '../features/reports/types';

export type { Report, ReportType };

/** Read a page from the local SQLite cache; cursor is a published_at epoch ms. */
export async function fetchFeed(params: {
  type?: ReportType; q?: string; cursor?: number; size?: number;
}): Promise<Report[]> {
  return queryReports(params);
}

/** Trigger an on-device sync from PAP into SQLite. */
export async function refreshFeed(): Promise<void> {
  await syncReports();
}
