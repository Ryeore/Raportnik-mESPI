import axios from 'axios';

export type ReportType = 'ESPI' | 'EBI';
export interface Report {
  id: string;
  companyId: string;
  type: ReportType;
  number: string;
  title: string;
  body: string;
  publishedAt: string;
}

const api = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1' });

export async function fetchFeed(params: {
  watchedOnly?: boolean; type?: ReportType; q?: string; cursor?: string; size?: number;
}): Promise<Report[]> {
  const { data } = await api.get<Report[]>('/reports', { params });
  return data;
}
