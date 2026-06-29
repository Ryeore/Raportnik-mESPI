---
name: espi-ingestion
description: "Use when adding or changing ESPI/EBI report ingestion: implementing a ReportIngestionSource (PAP scraper or official API), scheduling, dedup, or backend report feed/query work. Covers ports, idempotency, and persistence flow."
---

# ESPI/EBI Ingestion

## When to Use
- Implementing or swapping the data source for reports (PAP scraper → official API).
- Adding scheduling, retry/backoff, or dedup to ingestion.
- Extending the report feed/query or command sides.

## Architecture rules
- Source is swappable behind `ReportIngestionSource` (infrastructure). Domain and application must not know about PAP or HTML.
- `IngestionScheduler` pulls via the source and calls `repo.saveIfAbsent(...)` — keep it **idempotent by `external_id`**.
- Persistence: `JpaReportRepositoryAdapter` implements the domain `ReportRepository` port; entity is `ReportEntity`. Reads via `ReportQueryService` (CQRS read side).

## Procedure
1. Add/modify the source implementing `ReportIngestionSource`; map PAP fields → domain `Report`.
2. Ensure dedup: skip if `external_id` exists. Never throw on duplicates.
3. Add retry + backoff; on persistent failure, route to dead-letter (don't lose cron ticks).
4. Cron is config-driven (`ingestion.pap.cron` in [application.yml](../../../backend/src/main/resources/application.yml)).
5. Add unit tests (source mapping) + integration tests (save/dedup).
6. New columns/indexes → new Flyway migration in `backend/src/main/resources/db/migration/`.

## See also
- [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) ingestion flow
- [docs/DATABASE.md](../../../docs/DATABASE.md) report schema
