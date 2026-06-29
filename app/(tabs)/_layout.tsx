import React from "react";
import { Tabs } from "expo-router";
import { useAutoSync } from "@/hooks/useAutoSync";

export default function TabsLayout() {
  useAutoSync();
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#22C55E", headerStyle: { backgroundColor: "#0B1E3F" }, headerTintColor: "#fff" }}>
      <Tabs.Screen name="index" options={{ title: "Raporty" }} />
      <Tabs.Screen name="watched-reports" options={{ title: "Obserwowane" }} />
      <Tabs.Screen name="companies" options={{ title: "Spółki" }} />
      <Tabs.Screen name="search" options={{ title: "Szukaj" }} />
      <Tabs.Screen name="settings" options={{ title: "Ustawienia" }} />
    </Tabs>
  );
}
