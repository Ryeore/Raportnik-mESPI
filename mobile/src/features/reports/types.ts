export type ReportType = 'ESPI' | 'EBI';

export interface Report {
  id: string;
  externalId: string;
  companyId: string;
  type: ReportType;
  number: string;
  title: string;
  body: string;
  publishedAt: string; // ISO 8601
}

/** Keep roughly one month of reports on-device. */
export const RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
