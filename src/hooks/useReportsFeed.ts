import { useInfiniteQuery } from "@tanstack/react-query";
import { ReportRepository } from "@/database/ReportRepository";
import { PAGE_SIZE } from "@/utils/constants";

export function useReportsFeed() {
  return useInfiniteQuery({
    queryKey: ["reports"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => ReportRepository.list(PAGE_SIZE, pageParam * PAGE_SIZE),
    getNextPageParam: (last, all) => (last.length < PAGE_SIZE ? undefined : all.length)
  });
}
