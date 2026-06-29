import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WatchedCompanyRepository } from "@/database/WatchedCompanyRepository";

export function useWatchedCompanies() {
  return useQuery({ queryKey: ["watched"], queryFn: () => WatchedCompanyRepository.list() });
}

export function useWatchActions() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["watched"] });
    qc.invalidateQueries({ queryKey: ["watched-reports"] });
  };
  return {
    add: useMutation({
      mutationFn: async ({ ticker, name }: { ticker: string; name: string }) =>
        WatchedCompanyRepository.add(ticker, name),
      onSuccess: invalidate
    }),
    remove: useMutation({
      mutationFn: async (ticker: string) => WatchedCompanyRepository.remove(ticker),
      onSuccess: invalidate
    })
  };
}
