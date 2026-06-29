import { create } from "zustand";
import { AppSettings } from "@/types";
import { SettingsRepository } from "@/database/SettingsRepository";
import { ReportRepository } from "@/database/ReportRepository";

interface SettingsState extends AppSettings {
  hydrate: () => void;
  setAutoSync: (v: boolean) => void;
  setSyncInterval: (m: number) => void;
  clearDatabase: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  autoSync: true,
  syncIntervalMinutes: 30,
  hydrate: () => set(SettingsRepository.get()),
  setAutoSync: (v) => {
    SettingsRepository.set({ autoSync: v });
    set({ autoSync: v });
  },
  setSyncInterval: (m) => {
    SettingsRepository.set({ syncIntervalMinutes: m });
    set({ syncIntervalMinutes: m });
  },
  clearDatabase: () => {
    ReportRepository.clear();
    set({ ...get() });
  }
}));
