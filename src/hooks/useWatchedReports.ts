import { useInfiniteQuery } from "@tanstack/react-query";
import { ReportRepository } from "@/database/ReportRepository";
import { PAGE_SIZE } from "@/utils/constants";
import { SortOrder } from "@/types";

export function useWatchedReports(order: SortOrder) {
  return useInfiniteQuery({
    queryKey: ["watched-reports", order],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => ReportRepository.listWatched(order, PAGE_SIZE, pageParam * PAGE_SIZE),
    getNextPageParam: (last, all) => (last.length < PAGE_SIZE ? undefined : all.length)
  });
}
