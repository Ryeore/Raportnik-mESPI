import React from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ReportRepository } from "@/database/ReportRepository";
import { WatchedCompanyRepository } from "@/database/WatchedCompanyRepository";
import { EspiService } from "@/services/EspiService";
import { useTheme } from "@/store/theme";
import { formatDate } from "@/utils/date";

export function ReportDetailScreen({ id }: { id: string }) {
  const t = useTheme();
  const report = ReportRepository.getById(id);
  const content = useQuery({
    queryKey: ["report-content", id],
    queryFn: () => EspiService.fetchReportContent(report?.url ?? ""),
    enabled: !!report?.url
  });
  if (!report) return <Text style={{ color: t.text, padding: 16 }}>Nie znaleziono raportu.</Text>;

  const watched = WatchedCompanyRepository.isWatched(report.ticker);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View>
        <Text style={{ color: t.accent, fontWeight: "700" }}>{report.ticker} · {report.companyName}</Text>
        <Text style={{ color: t.sub, fontSize: 12 }}>Nr {report.reportNumber} · {formatDate(report.publishDate)}</Text>
      </View>
      <Text style={{ color: t.text, fontSize: 18, fontWeight: "700" }}>{report.title}</Text>
      {content.isLoading ? (
        <ActivityIndicator color={t.accent} />
      ) : (
        <Text style={{ color: t.text, lineHeight: 22 }}>{content.data || report.content}</Text>
      )}
      {!watched && (
        <Pressable onPress={() => WatchedCompanyRepository.add(report.ticker, report.companyName)} style={{ backgroundColor: t.accent, borderRadius: 10, padding: 12, alignItems: "center" }}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Dodaj do obserwowanych</Text>
        </Pressable>
      )}
      {!!report.url && (
        <Pressable onPress={() => Linking.openURL(report.url)}>
          <Text style={{ color: t.accent }}>Otwórz źródło</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
