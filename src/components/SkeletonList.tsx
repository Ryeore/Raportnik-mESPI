import React from "react";
import { View } from "react-native";
import { useTheme } from "@/store/theme";

export function SkeletonList({ count = 6 }: { count?: number }) {
  const t = useTheme();
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={{ backgroundColor: t.card, height: 78, borderRadius: 14, marginHorizontal: 16, marginVertical: 6, opacity: 0.5 }} />
      ))}
    </View>
  );
}
