/**
 * Core domain model. The whole app depends only on this shape, so the data
 * source can be swapped without touching UI or storage layers.
 */
export interface EspiReport {
  id: string;
  companyName: string;
  ticker: string;
  reportNumber: string;
  publishDate: string;
  title: string;
  content: string;
  url: string;
}

export interface WatchedCompany {
  ticker: string;
  companyName: string;
  addedAt: string;
}

export type SortOrder = "newest" | "oldest";

export interface AppSettings {
  autoSync: boolean;
  syncIntervalMinutes: number;
}
