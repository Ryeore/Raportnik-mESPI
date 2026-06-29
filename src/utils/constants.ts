export const RETENTION_DAYS = 30;
export const SYNC_INTERVAL_MINUTES = 30;
export const PAGE_SIZE = 20;
export const SEARCH_DEBOUNCE_MS = 350;

export const SOURCE_BASE_URL = "https://espiebi.pap.pl";

/** Max search-result pages to scrape per date before stopping. */
export const MAX_PAGES_PER_DATE = 20;

/** Builds the search-results URL for a date (YYYY-MM-DD) and page index. */
export function searchPageUrl(dateIso: string, page: number): string {
  return `${SOURCE_BASE_URL}/wyszukiwarka?created=${dateIso}&enddate=${dateIso}%2023%3A59&page=${page}`;
}
