import { create } from 'zustand';
import type { FinancialReport } from '../../domain/models/FinancialReport';
import { ReportRepository } from '../../data/repositories/ReportRepository';
import { getFeedPage } from '../usecases/GetFeedPage';

const repository = new ReportRepository();

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/** Merge two report arrays and remove any duplicate sourceUrls. */
function mergeUnique(
  existing: FinancialReport[],
  incoming: FinancialReport[],
): FinancialReport[] {
  const seen = new Set(existing.map((r) => r.sourceUrl));
  const fresh = incoming.filter((r) => {
    if (seen.has(r.sourceUrl)) return false;
    seen.add(r.sourceUrl);
    return true;
  });
  return [...existing, ...fresh];
}

interface FeedState {
  reports: FinancialReport[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  searchQuery: string;

  // Actions
  loadInitial: () => Promise<void>;
  loadNextPage: () => Promise<void>;
  refresh: () => Promise<void>;
  setSearchQuery: (q: string) => void;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  reports: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  currentPage: 0,
  hasMore: true,
  searchQuery: '',

  loadInitial: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null, currentPage: 0, reports: [], hasMore: true });
    try {
      const page = await getFeedPage(repository, todayISO(), 0);
      set({ reports: page.reports, hasMore: page.hasMore, currentPage: 0 });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load feed' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadNextPage: async () => {
    const { isLoading, hasMore, currentPage, reports } = get();
    if (isLoading || !hasMore) return;
    set({ isLoading: true, error: null });
    try {
      const nextPage = currentPage + 1;
      const page = await getFeedPage(repository, todayISO(), nextPage);
      set({
        reports: mergeUnique(reports, page.reports),
        hasMore: page.hasMore,
        currentPage: nextPage,
      });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load more' });
    } finally {
      set({ isLoading: false });
    }
  },

  refresh: async () => {
    if (get().isRefreshing) return;
    set({ isRefreshing: true, error: null });
    try {
      const page = await getFeedPage(repository, todayISO(), 0);
      set({ reports: page.reports, hasMore: page.hasMore, currentPage: 0 });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to refresh' });
    } finally {
      set({ isRefreshing: false });
    }
  },

  setSearchQuery: (q: string) => set({ searchQuery: q }),
}));

/** Derived selector — apply search filter in-memory */
export function selectFilteredReports(state: FeedState): FinancialReport[] {
  const q = state.searchQuery.toLowerCase().trim();
  if (!q) return state.reports;
  return state.reports.filter(
    (r) =>
      r.companyName.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.reportNumber.toLowerCase().includes(q),
  );
}
