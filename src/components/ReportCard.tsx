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
  return (
    <Pressable
      onPress={() => onPress(report.id)}
      style={{ backgroundColor: t.card, borderRadius: 14, padding: 14, marginHorizontal: 16, marginVertical: 6 }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: t.accent, fontWeight: "700" }}>{report.ticker}</Text>
        <Text style={{ color: t.sub, fontSize: 12 }}>{formatDate(report.publishDate)}</Text>
      </View>
      <Text style={{ color: t.text, fontWeight: "600", marginTop: 4 }} numberOfLines={2}>
        {report.title}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
        <Text style={{ color: t.sub, fontSize: 12 }} numberOfLines={1}>{report.companyName}</Text>
        <Text style={{ color: t.sub, fontSize: 12 }}>Nr {report.reportNumber}</Text>
      </View>
      {isNew && (
        <View style={{ position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: t.accent }} />
      )}
    </Pressable>
  );
}

export const ReportCard = React.memo(ReportCardBase);
