import { create } from 'zustand';
import type { ReportDetail } from '../../domain/repositories/IReportRepository';
import { ReportRepository } from '../../data/repositories/ReportRepository';
import { getReportDetail } from '../usecases/GetReportDetail';

const repository = new ReportRepository();

interface DetailState {
  id: string | null;
  detail: ReportDetail | null;
  isLoading: boolean;
  error: string | null;

  load: (id: string) => Promise<void>;
  clear: () => void;
}

export const useDetailStore = create<DetailState>((set, get) => ({
  id: null,
  detail: null,
  isLoading: false,
  error: null,

  load: async (id: string) => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null, detail: null, id });
    try {
      const detail = await getReportDetail(repository, id);
      set({ detail });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load report' });
    } finally {
      set({ isLoading: false });
    }
  },

  clear: () => set({ id: null, detail: null, error: null, isLoading: false }),
}));
