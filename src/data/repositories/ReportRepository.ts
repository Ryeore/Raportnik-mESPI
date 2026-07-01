import { PapEspiClient } from '../remote/PapEspiClient';
import { parseFeedHtml } from '../parsers/feedParser';
import { parseDetailHtml } from '../parsers/detailParser';
import { ReportType } from '../../domain/models/FinancialReport';
import type { IReportRepository, FeedPage, ReportDetail } from '../../domain/repositories/IReportRepository';

export class DataSourceError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'DataSourceError';
  }
}

export class ReportRepository implements IReportRepository {
  async getFeedPage(date: string, page: number): Promise<FeedPage> {
    // Fetch ESPI and EBI in parallel; tolerate one side failing
    const [espiResult, ebiResult] = await Promise.allSettled([
      PapEspiClient.getFeedHtml('espi', date, page),
      PapEspiClient.getFeedHtml('ebi', date, page),
    ]);

    const reports = [];

    for (const [result, type] of [
      [espiResult, ReportType.ESPI],
      [ebiResult, ReportType.EBI],
    ] as const) {
      if (result.status === 'rejected') continue;
      const parsed = parseFeedHtml(result.value, date, type);
      if (parsed.ok) reports.push(...parsed.data);
    }

    if (reports.length === 0 && espiResult.status === 'rejected' && ebiResult.status === 'rejected') {
      throw new DataSourceError(
        `Failed to fetch feed for ${date}: ${(espiResult.reason as Error)?.message}`,
      );
    }

    // Deduplicate by sourceUrl — same article can appear in both ESPI and EBI feeds
    const seen = new Set<string>();
    const unique = reports.filter((r) => {
      if (seen.has(r.sourceUrl)) return false;
      seen.add(r.sourceUrl);
      return true;
    });

    // Sort descending by time (most recent first)
    unique.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());

    return {
      reports: unique,
      hasMore: unique.length >= 25,
    };
  }

  async getReportDetail(path: string): Promise<ReportDetail> {
    let html: string;
    try {
      html = await PapEspiClient.getDetailHtml(path);
    } catch (err) {
      throw new DataSourceError(`Failed to fetch detail for ${path}`, err);
    }

    const result = parseDetailHtml(html);
    if (!result.ok) {
      throw new DataSourceError(`Failed to parse detail HTML: ${result.error}`);
    }

    return {
      headers: result.data.headers,
      body: result.data.body,
    };
  }
}

