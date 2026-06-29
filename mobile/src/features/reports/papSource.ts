import axios from 'axios';
import { Report, ReportType } from './types';

/**
 * Swappable on-device data source for ESPI/EBI reports. Mirrors the backend's
 * `ReportIngestionSource` contract: fetch latest reports, mapped to the domain
 * shape. Replace BASE_URL/parsing when the official API endpoint is finalized.
 */
const BASE_URL = process.env.EXPO_PUBLIC_PAP_URL ?? 'https://espiebi.pap.pl';

interface RawReport {
  id?: string | number;
  externalId?: string;
  company?: string;
  companyId?: string;
  type?: string;
  number?: string;
  title?: string;
  body?: string;
  content?: string;
  publishedAt?: string;
  date?: string;
}

function normalizeType(raw?: string): ReportType {
  return (raw ?? '').toUpperCase() === 'EBI' ? 'EBI' : 'ESPI';
}

function mapRaw(r: RawReport): Report | null {
  const externalId = String(r.externalId ?? r.id ?? '').trim();
  if (!externalId) return null;
  const publishedAt = r.publishedAt ?? r.date ?? new Date().toISOString();
  return {
    id: externalId,
    externalId,
    companyId: String(r.companyId ?? r.company ?? 'unknown'),
    type: normalizeType(r.type),
    number: r.number ?? '',
    title: r.title ?? '(no title)',
    body: r.body ?? r.content ?? '',
    publishedAt: new Date(publishedAt).toISOString(),
  };
}

/** Fetch reports published since the given time. Returns [] on failure. */
export async function fetchLatest(since: Date): Promise<Report[]> {
  try {
    const { data } = await axios.get<RawReport[]>(`${BASE_URL}/api/reports`, {
      params: { from: since.toISOString() },
      timeout: 15000,
    });
    return data.map(mapRaw).filter((r): r is Report => r !== null);
  } catch {
    return [];
  }
}
