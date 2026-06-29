import { EspiService } from "./EspiService";
import { ReportRepository } from "@/database/ReportRepository";
import { WatchedCompanyRepository } from "@/database/WatchedCompanyRepository";
import { notifyNewReport } from "@/notifications/notifications";

/**
 * Runs a full sync and notifies for new reports of watched companies.
 * Returns count of new reports.
 */
export async function runSync(): Promise<number> {
  const newIds = await EspiService.syncReports();
  if (newIds.length === 0) return 0;

  const watched = new Set(WatchedCompanyRepository.tickers());
  for (const id of newIds) {
    const report = ReportRepository.getById(id);
    if (report && watched.has(report.ticker)) {
      await notifyNewReport(report);
    }
  }
  return newIds.length;
}
