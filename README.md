# Raportnik

Mobilna aplikacja do śledzenia raportów ESPI z GPW (źródło: espiebi.pap.pl). Bez logowania.

## Stack
React Native + Expo · Expo Router · TypeScript · SQLite · TanStack Query · Zustand · NativeWind · Axios · Expo Notifications.

## Struktura
```
app/                 # Expo Router (tabs + report/[id])
src/components/      # ReportCard, Skeleton, EmptyState
src/screens/         # Feed, WatchedReports, Companies, Search, Settings, Detail
src/services/        # EspiSource, EspiParser, EspiService, SyncManager
src/database/        # db + ReportRepository, WatchedCompanyRepository, SettingsRepository
src/hooks/           # React Query hooks + useAutoSync
src/store/           # Zustand settings + theme
src/types/, src/utils/, src/notifications/
__tests__/           # parser, retention, repository
```

## Start
```bash
npm install
npm start
npm test
```

## Dane
Tylko 30 dni lokalnie; dedupe po `id`; auto-sync co 30 min; powiadomienia o raportach obserwowanych spółek. Źródło wymienne przez `EspiSource`.
