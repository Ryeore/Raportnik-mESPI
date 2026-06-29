import React from "react";
import { useLocalSearchParams } from "expo-router";
import { ReportDetailScreen } from "@/screens/ReportDetailScreen";

export default function ReportRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ReportDetailScreen id={id} />;
}
