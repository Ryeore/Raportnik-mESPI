import { EspiReport } from "@/types";
import { isWithinRetention } from "@/utils/date";

/**
 * Parses the raw PAP/ESPI list payload into domain reports. Kept pure and
 * source-shape-specific so it can be unit tested in isolation.
 */
export interface RawPapItem {
  id?: string | number;
  ticker?: string;
  company?: string;
  number?: string;
  date?: string;
  title?: string;
  body?: string;
  link?: string;
}

export function parseReports(raw: RawPapItem[], now: Date = new Date()): EspiReport[] {
  return raw
    .filter((i) => i && i.id != null && i.date)
    .map((i) => ({
      id: String(i.id),
      companyName: (i.company ?? "").trim(),
      ticker: (i.ticker ?? "").trim().toUpperCase(),
      reportNumber: (i.number ?? "").trim(),
      publishDate: new Date(i.date as string).toISOString(),
      title: (i.title ?? "").trim(),
      content: (i.body ?? "").trim(),
      url: i.link ?? ""
    }))
    .filter((r) => isWithinRetention(r.publishDate, now));
}
