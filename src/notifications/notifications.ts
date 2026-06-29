import * as Notifications from "expo-notifications";
import { EspiReport } from "@/types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function notifyNewReport(report: EspiReport): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Nowy raport ESPI",
      body: `${report.ticker} - ${report.title}`,
      data: { reportId: report.id }
    },
    trigger: null
  });
}
