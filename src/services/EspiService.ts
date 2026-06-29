import axios from "axios";
import { EspiReport } from "@/types";
import { SOURCE_BASE_URL, PAGE_SIZE } from "@/utils/constants";
import { EspiSource } from "./EspiSource";
import { parseReports, RawPapItem } from "./EspiParser";
import { ReportRepository } from "@/database/ReportRepository";

/** Default source: espiebi.pap.pl. Replaceable via constructor injection. */
class PapSource implements EspiSource {
  async fetchLatest(): Promise<EspiReport[]> {
    const { data } = await axios.get<RawPapItem[]>(`${SOURCE_BASE_URL}/api/reports`, { timeout: 15000 });
    return parseReports(Array.isArray(data) ? data : []);
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

  /** Fetches, dedupes, persists, prunes >30d. Returns new report ids. */
  async syncReports(): Promise<string[]> {
    const reports = await this.source.fetchLatest();
    const newIds = ReportRepository.upsertMany(reports);
    ReportRepository.prune();
    return newIds;
  }
}

export const EspiService = new EspiServiceImpl();
