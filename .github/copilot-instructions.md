---
applyTo: "**"
---
# Raportnik — Copilot instructions

Mobile app for tracking GPW ESPI reports (source: espiebi.pap.pl).

## Stack
React Native + Expo, Expo Router, TypeScript, expo-sqlite, TanStack Query, Zustand, NativeWind, Axios, Expo Notifications.

## Architecture rules
- Keep clean layering: `app/` routes → `src/screens` → `src/hooks` (React Query) → `src/services` + `src/database` repositories → SQLite/HTTP.
- Data source must stay pluggable via `EspiSource`/`EspiParser`. UI/storage depend only on `EspiReport`.
- Retain only last 30 days locally; dedupe on insert; auto-sync every 30 min.
- Use FlatList, `React.memo`, local pagination; no unnecessary re-renders.
- Colors: navy dominant, green accents for new reports; support light+dark.
- All code, comments and instructions in English.
