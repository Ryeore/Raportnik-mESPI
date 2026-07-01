export enum ReportType {
  ESPI = 'ESPI',
  EBI = 'EBI',
}

export interface FinancialReport {
  /** Node ID from URL slug, e.g. "1234567" */
  id: string;
  /** Short company name as it appears in the feed */
  companyName: string;
  /** Ticker or ISIN — null when not available in the feed row */
  ticker: string | null;
  reportType: ReportType;
  /** Sequential number, e.g. "14/2026" */
  reportNumber: string;
  /** Announcement subject */
  title: string;
  /** Publication timestamp */
  dateTime: Date;
  /** https://espiebi.pap.pl/node/{id} */
  sourceUrl: string;
}
