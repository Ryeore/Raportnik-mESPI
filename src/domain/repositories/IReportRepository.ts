import type { FinancialReport } from '../models/FinancialReport';

export interface FeedPage {
  reports: FinancialReport[];
  /** True when the scraped page returned at least one item (more pages may exist) */
  hasMore: boolean;
}

export interface ReportDetail {
  /** Key/value header pairs extracted from the nDokument table */
  headers: Record<string, string>;
  /** Full report body as plain text */
  body: string;
}

export interface IReportRepository {
  getFeedPage(date: string, page: number): Promise<FeedPage>;
  getReportDetail(id: string): Promise<ReportDetail>;
}
