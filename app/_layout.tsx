import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { initDatabase } from "@/database/db";
import { useSettingsStore } from "@/store/settingsStore";
import { requestNotificationPermission } from "@/notifications/notifications";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, gcTime: 5 * 60_000 } }
});

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const hydrate = useSettingsStore((s) => s.hydrate);
  const router = useRouter();

  useEffect(() => {
    initDatabase();
    hydrate();
    requestNotificationPermission();
    setReady(true);
    const sub = Notifications.addNotificationResponseReceivedListener((res) => {
      const id = res.notification.request.content.data?.reportId;
      if (id) router.push(`/report/${id}`);
    });
    return () => sub.remove();
  }, []);

  if (!ready) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="report/[id]" options={{ headerShown: true, title: "Raport", presentation: "card" }} />
      </Stack>
    </QueryClientProvider>
  );
}
