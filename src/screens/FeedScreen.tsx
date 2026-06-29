import React, { useMemo } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useRouter } from "expo-router";
import { useReportsFeed } from "@/hooks/useReportsFeed";
import { ReportCard } from "@/components/ReportCard";
import { SkeletonList } from "@/components/SkeletonList";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/store/theme";

export function FeedScreen() {
  const t = useTheme();
  const router = useRouter();
  const q = useReportsFeed();
  const reports = useMemo(() => q.data?.pages.flat() ?? [], [q.data]);

  if (q.isLoading) return <View style={{ flex: 1, backgroundColor: t.bg, paddingTop: 12 }}><SkeletonList /></View>;

  return (
    <FlatList
      style={{ backgroundColor: t.bg }}
      contentContainerStyle={{ paddingVertical: 8 }}
      data={reports}
      keyExtractor={(r) => r.id}
      renderItem={({ item }) => <ReportCard report={item} onPress={(id) => router.push(`/report/${id}`)} />}
      onEndReached={() => q.hasNextPage && q.fetchNextPage()}
      onEndReachedThreshold={0.5}
      refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={q.refetch} />}
      ListEmptyComponent={<EmptyState message="Brak raportów. Pociągnij, aby odświeżyć." />}
    />
  );
}
