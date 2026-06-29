# User Stories + Backlog MVP

## User Stories
- US1: Jako użytkownik rejestruję się emailem lub Google/Apple, by mieć konto.
- US2: Wyszukuję spółki GPW i dodaję/usuwam z obserwowanych.
- US3: Przeglądam feed raportów z infinite scroll i pull-to-refresh, grupowany po dniach.
- US4: Filtruję feed (obserwowane / typ / daty / słowa kluczowe).
- US5: Otwieram szczegóły raportu, oznaczam jako przeczytany, udostępniam.
- US6: Dostaję push o nowym raporcie obserwowanej spółki (immediate/digest).
- US7: Zarządzam profilem: obserwowane, historia, ustawienia powiadomień.

## Sprinty (2-tyg.)
- **S1 — Fundament:** repo, CI/CD, DB, auth (email+JWT), encje Company/Report. (US1)
- **S2 — Spółki + feed:** watchlist, feed + paginacja, scraper PAP v1. (US2, US3)
- **S3 — Filtry + szczegóły:** filtrowanie, detail, mark-read, share. (US4, US5)
- **S4 — Push:** FCM, immediate + daily digest, ustawienia. (US6, US7)
- **S5 — Hardening:** testy, monitoring, beta release.

## Roadmapa
AI summary, sentyment, alerty słów kluczowych, widget, sync watchlist, ranking spółek.
