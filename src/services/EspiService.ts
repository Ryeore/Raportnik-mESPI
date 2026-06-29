import { EspiReport } from "@/types";
import { PAGE_SIZE, MAX_PAGES_PER_DATE, searchPageUrl } from "@/utils/constants";
import { EspiSource } from "./EspiSource";
import { parseListHtml, parseNodeContent } from "./EspiParser";
import { fetchHtml } from "./PapWebFetcher";
import { ReportRepository } from "@/database/ReportRepository";

/** Default source: scrapes espiebi.pap.pl (no public API). Replaceable via DI. */
class PapSource implements EspiSource {
  /** Scrapes today's search results, paging until a page has no reports. */
  async fetchLatest(): Promise<EspiReport[]> {
    const dateIso = new Date().toISOString().slice(0, 10);
    const all: EspiReport[] = [];

    for (let page = 0; page < MAX_PAGES_PER_DATE; page++) {
      const html = await fetchHtml(searchPageUrl(dateIso, page));
      const reports = parseListHtml(html, dateIso);
      if (reports.length === 0) break;
      all.push(...reports);
    }

    return all;
  }
}

class EspiServiceImpl {
  constructor(private source: EspiSource = new PapSource()) {}

  fetchLatestReports() {
    return this.source.fetchLatest();
  }

  fetchReportsByTicker(ticker: string) {
    return ReportRepository.search(ticker, PAGE_SIZE, 0);
  }

  searchReports(query: string) {
    return ReportRepository.search(query, PAGE_SIZE, 0);
  }
  async syncReports(): Promise<string[]> {
    const reports = await this.source.fetchLatest();
    const newIds = ReportRepository.upsertMany(reports);
    ReportRepository.prune();
    return newIds;
  }

  /** Fetches the full report body from its node page (lazy, on detail open). */
  async fetchReportContent(url: string): Promise<string> {
    if (!url) return "";
    const html = await fetchHtml(url);
    return parseNodeContent(html);
  }
}

export const EspiService = new EspiServiceImpl();
