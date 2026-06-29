import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useWatchedReports } from "@/hooks/useWatchedReports";
import { ReportCard } from "@/components/ReportCard";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/store/theme";
import { SortOrder } from "@/types";

export function WatchedReportsScreen() {
  const t = useTheme();
  const router = useRouter();
  const [order, setOrder] = useState<SortOrder>("newest");
  const q = useWatchedReports(order);
  const reports = useMemo(() => q.data?.pages.flat() ?? [], [q.data]);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <View style={{ flexDirection: "row", gap: 8, padding: 12 }}>
        {(["newest", "oldest"] as SortOrder[]).map((o) => (
          <Pressable key={o} onPress={() => setOrder(o)} style={{ paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: order === o ? t.accent : t.card }}>
            <Text style={{ color: order === o ? "#fff" : t.text }}>{o === "newest" ? "Najnowsze" : "Najstarsze"}</Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={reports}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => <ReportCard report={item} onPress={(id) => router.push(`/report/${id}`)} />}
        onEndReached={() => q.hasNextPage && q.fetchNextPage()}
        ListEmptyComponent={<EmptyState message="Brak raportów obserwowanych spółek." />}
      />
    </View>
  );
}
