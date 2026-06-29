import React from "react";
import { Text } from "react-native";
import { useTheme } from "@/store/theme";

export function EmptyState({ message }: { message: string }) {
  const t = useTheme();
  return <Text style={{ color: t.sub, textAlign: "center", marginTop: 48 }}>{message}</Text>;
}
