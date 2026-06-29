import React from "react";
import { Pressable, Text, View } from "react-native";
import { EspiReport } from "@/types";
import { formatDate } from "@/utils/date";
import { useTheme } from "@/store/theme";

interface Props {
  report: EspiReport;
  isNew?: boolean;
  onPress: (id: string) => void;
}

function ReportCardBase({ report, isNew, onPress }: Props) {
  const t = useTheme();
  const title =
    report.companyName && report.title.startsWith(`${report.companyName}:`)
      ? report.title.slice(report.companyName.length + 1).trim()
      : report.title;
  return (
    <Pressable
      onPress={() => onPress(report.id)}
      style={{ backgroundColor: t.card, borderRadius: 14, padding: 14, marginHorizontal: 16, marginVertical: 6 }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: t.accent, fontWeight: "700", flex: 1 }} numberOfLines={1}>
          {report.companyName || report.ticker}
        </Text>
        <Text style={{ color: t.sub, fontSize: 12, marginLeft: 8 }}>{formatDate(report.publishDate)}</Text>
      </View>
      <Text style={{ color: t.text, fontWeight: "600", marginTop: 4 }} numberOfLines={2}>
        {title}
      </Text>
      {isNew && (
        <View style={{ position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: t.accent }} />
      )}
    </Pressable>
  );
}

export const ReportCard = React.memo(ReportCardBase);
