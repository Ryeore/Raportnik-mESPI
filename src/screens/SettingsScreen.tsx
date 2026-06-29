import React from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { useSettingsStore } from "@/store/settingsStore";
import { useTheme } from "@/store/theme";

const INTERVALS = [15, 30, 60];

export function SettingsScreen() {
  const t = useTheme();
  const { autoSync, syncIntervalMinutes, setAutoSync, setSyncInterval, clearDatabase } = useSettingsStore();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.bg }} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: t.text, fontSize: 16 }}>Automatyczna synchronizacja</Text>
        <Switch value={autoSync} onValueChange={setAutoSync} trackColor={{ true: t.accent }} />
      </View>
      <View>
        <Text style={{ color: t.text, fontSize: 16, marginBottom: 8 }}>Częstotliwość (min)</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {INTERVALS.map((m) => (
            <Pressable key={m} onPress={() => setSyncInterval(m)} style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: syncIntervalMinutes === m ? t.accent : t.card }}>
              <Text style={{ color: syncIntervalMinutes === m ? "#fff" : t.text }}>{m}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <Pressable onPress={clearDatabase} style={{ backgroundColor: "#EF4444", borderRadius: 10, padding: 14, alignItems: "center" }}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Wyczyść lokalną bazę</Text>
      </Pressable>
    </ScrollView>
  );
}
