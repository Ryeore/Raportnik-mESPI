import React, { useState } from "react";
import { FlatList, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useSearchReports } from "@/hooks/useSearchReports";
import { ReportCard } from "@/components/ReportCard";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/store/theme";

export function SearchScreen() {
  const t = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { data = [], isFetching } = useSearchReports(query);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg, paddingTop: 12 }}>
      <TextInput
        placeholder="Ticker, spółka, tytuł..." placeholderTextColor={t.sub}
        value={query} onChangeText={setQuery}
        style={{ backgroundColor: t.card, color: t.text, borderRadius: 10, padding: 12, marginHorizontal: 16 }}
      />
      <FlatList
        data={data}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => <ReportCard report={item} onPress={(id) => router.push(`/report/${id}`)} />}
        ListEmptyComponent={<EmptyState message={isFetching ? "Szukam..." : "Wpisz frazę, aby wyszukać."} />}
      />
    </View>
  );
}
