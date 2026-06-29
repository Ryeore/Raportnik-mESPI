import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ReportRepository } from "@/database/ReportRepository";
import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "@/utils/constants";

export function useSearchReports(query: string) {
  const [debounced, setDebounced] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  return useQuery({
    queryKey: ["search", debounced],
    queryFn: () => (debounced.trim() ? ReportRepository.search(debounced.trim(), PAGE_SIZE, 0) : []),
    enabled: debounced.trim().length > 0
  });
}
