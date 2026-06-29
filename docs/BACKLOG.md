# User Stories + Backlog MVP

## User Stories
- US1: As a user, I register with email or Google/Apple to have an account.
- US2: I search WSE companies and add/remove them from my watchlist.
- US3: I browse the report feed with infinite scroll and pull-to-refresh, grouped by day.
- US4: I filter the feed (watched / type / dates / keywords).
- US5: I open report details, mark them as read, and share them.
- US6: I receive a push notification about a new report of a watched company (immediate/digest).
- US7: I manage my profile: watchlist, history, notification settings.

## Sprints (2 weeks)
- **S1 — Foundation:** repo, CI/CD, DB, auth (email+JWT), Company/Report entities. (US1)
- **S2 — Companies + feed:** watchlist, feed + pagination, PAP scraper v1. (US2, US3)
- **S3 — Filters + details:** filtering, detail, mark-read, share. (US4, US5)
- **S4 — Push:** FCM, immediate + daily digest, settings. (US6, US7)
- **S5 — Hardening:** tests, monitoring, beta release.

## Roadmap
AI summary, sentiment, keyword alerts, widget, watchlist sync, company ranking.
