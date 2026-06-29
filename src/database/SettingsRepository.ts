import { getDb } from "./db";
import { AppSettings } from "@/types";
import { SYNC_INTERVAL_MINUTES } from "@/utils/constants";

const DEFAULTS: AppSettings = { autoSync: true, syncIntervalMinutes: SYNC_INTERVAL_MINUTES };

export const SettingsRepository = {
  get(): AppSettings {
    const rows = getDb().getAllSync<{ key: string; value: string }>(`SELECT * FROM app_settings`);
    const map = new Map(rows.map((r) => [r.key, r.value]));
    return {
      autoSync: map.has("autoSync") ? map.get("autoSync") === "true" : DEFAULTS.autoSync,
      syncIntervalMinutes: map.has("syncIntervalMinutes")
        ? Number(map.get("syncIntervalMinutes"))
        : DEFAULTS.syncIntervalMinutes
    };
  },

  set(settings: Partial<AppSettings>): void {
    const db = getDb();
    for (const [key, value] of Object.entries(settings)) {
      db.runSync(`INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)`, [key, String(value)]);
    }
  }
};
