import React, { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useWatchedCompanies, useWatchActions } from "@/hooks/useWatchedCompanies";
import { EmptyState } from "@/components/EmptyState";
import { useTheme } from "@/store/theme";

export function WatchedCompaniesScreen() {
  const t = useTheme();
  const { data: companies = [] } = useWatchedCompanies();
  const { add, remove } = useWatchActions();
  const [ticker, setTicker] = useState("");
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");

  const filtered = companies.filter(
    (c) => c.ticker.includes(query.toUpperCase()) || c.companyName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: t.bg, padding: 12 }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput placeholder="Ticker" placeholderTextColor={t.sub} value={ticker} onChangeText={setTicker} style={{ flex: 1, backgroundColor: t.card, color: t.text, borderRadius: 10, padding: 10 }} />
        <TextInput placeholder="Nazwa" placeholderTextColor={t.sub} value={name} onChangeText={setName} style={{ flex: 2, backgroundColor: t.card, color: t.text, borderRadius: 10, padding: 10 }} />
        <Pressable onPress={() => { if (ticker) { add.mutate({ ticker: ticker.toUpperCase(), name }); setTicker(""); setName(""); } }} style={{ backgroundColor: t.accent, borderRadius: 10, justifyContent: "center", paddingHorizontal: 16 }}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>+</Text>
        </Pressable>
      </View>
      <TextInput placeholder="Szukaj..." placeholderTextColor={t.sub} value={query} onChangeText={setQuery} style={{ backgroundColor: t.card, color: t.text, borderRadius: 10, padding: 10, marginTop: 8 }} />
      <FlatList
        data={filtered}
        keyExtractor={(c) => c.ticker}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: t.card, borderRadius: 10, padding: 12, marginTop: 8 }}>
            <Text style={{ color: t.text }}>{item.ticker} · {item.companyName}</Text>
            <Pressable onPress={() => remove.mutate(item.ticker)}><Text style={{ color: "#EF4444" }}>Usuń</Text></Pressable>
          </View>
        )}
        ListEmptyComponent={<EmptyState message="Brak obserwowanych spółek." />}
      />
    </View>
  );
}
