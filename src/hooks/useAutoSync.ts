import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { runSync } from "@/services/SyncManager";
import { useSettingsStore } from "@/store/settingsStore";

/** Runs sync on mount and on the configured interval; refreshes feeds. */
export function useAutoSync() {
  const qc = useQueryClient();
  const { autoSync, syncIntervalMinutes } = useSettingsStore();
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const sync = async () => {
      await runSync();
      qc.invalidateQueries({ queryKey: ["reports"] });
      qc.invalidateQueries({ queryKey: ["watched-reports"] });
    };
    sync();
    if (autoSync) {
      timer.current = setInterval(sync, syncIntervalMinutes * 60 * 1000);
    }
    return () => clearInterval(timer.current);
  }, [autoSync, syncIntervalMinutes, qc]);
}
