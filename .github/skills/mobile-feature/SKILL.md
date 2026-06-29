---
name: mobile-feature
description: "Use when building a React Native (Expo) screen or feature for Raportnik mobile: feed, filters, company search, report detail, push, or profile. Covers feature-first structure, API layer, react-query, and zustand."
---

# Mobile Feature

## When to Use
- Adding a screen/feature under `mobile/src/features/`.
- Wiring API calls, server state, or navigation.

## Structure
- Feature-first: `mobile/src/features/<feature>/<Screen>.tsx`. Existing: `feed/FeedScreen.tsx`, `feed/ReportDetailScreen.tsx`.
- HTTP in `mobile/src/api/` (axios). Server state via `@tanstack/react-query`; client/UI state via `zustand`.
- Navigation: `@react-navigation/native-stack`.

## Procedure
1. Create the feature folder + screen; keep components presentational.
2. Add API functions in `src/api/` typed against [docs/API.md](../../../docs/API.md) endpoints.
3. Use react-query hooks for fetch/cache; infinite scroll = `useInfiniteQuery` with cursor `size=20`.
4. English UI strings only; ESPI/EBI badges, day grouping per [docs/UI.md](../../../docs/UI.md).
5. Add Jest tests; run `cd mobile && npm test`.

## Conventions
- No hardcoded base URLs/secrets; use env config.
- Match user stories in [docs/BACKLOG.md](../../../docs/BACKLOG.md).
