import { RETENTION_DAYS } from "./constants";

/** Returns the ISO cutoff date for the local retention window. */
export function retentionCutoffIso(now: Date = new Date()): string {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
  return cutoff.toISOString();
}

export function isWithinRetention(publishDate: string, now: Date = new Date()): boolean {
  return new Date(publishDate).getTime() >= new Date(retentionCutoffIso(now)).getTime();
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

/** Compact "DD.MM HH:MM" — no year, for tight rows like list cards. */
export function formatDateTimeCompact(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}
