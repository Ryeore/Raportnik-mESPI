# Raportnik (MVP v0.1)

Mobile-first lightweight news reader for PAP Espiebi, focused on fast, clean
consumption of breaking news in a scrollable feed.

## Structure

- `backend/` — Node.js (Express) API. Scrapes `espiebi.pap.pl`, normalizes
  articles, caches for 5 min. Falls back to sample data when the source is
  unreachable (the site is bot-protected). Exposes `GET /api/news`.
- `app/` — Expo / React Native app. Feed screen + article screen, pull-to-refresh,
  loading / empty / error states.

## API contract

`GET /api/news`

```json
{
  "source": "espiebi.pap.pl",
  "articles": [
    { "id": "...", "title": "...", "url": "https://...", "publishedAt": "2026-06-29T10:00:00Z", "summary": "optional" }
  ]
}
```

## Run

Backend:
```
cd backend
npm install
npm start          # http://localhost:4000
```

App:
```
cd app
npm install
npm start          # press a (Android) or i (iOS) — mobile only
```

Physical device: set `EXPO_PUBLIC_API_URL` to your machine's LAN IP, e.g.
`EXPO_PUBLIC_API_URL=http://192.168.1.10:4000 npm start`.
