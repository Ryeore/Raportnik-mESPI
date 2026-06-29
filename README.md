# Raportnik

Mobile app for monitoring **ESPI/EBI** reports of companies listed on the WSE (GPW).
Users receive real-time reports of selected companies and conveniently filter and browse them.

> Data source: https://espiebi.pap.pl/ (start: scraper, eventually: official API). The ingestion layer is abstracted, so changing the source does not require changes in the domain.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React Native (Expo) + TypeScript |
| Backend | Spring Boot 3 + Java 21 |
| DB | PostgreSQL 16 |
| Push | Firebase Cloud Messaging |
| Auth | OAuth2 / JWT (Google, Apple, email) |
| Infra | Docker, Kubernetes-ready |
| CI/CD | GitHub Actions |

## Monorepo

```
Raportnik-mESPI/
├── backend/        # Spring Boot 3, Java 21, Clean Arch + CQRS + DDD
├── mobile/         # Expo + TS, feature-first clean architecture
├── docs/           # Architecture, DB, API, backlog, scaling, cost, monetization
├── infra/          # docker-compose, k8s manifests
└── .github/        # CI/CD
```

## Documentation

- [System architecture + diagrams](docs/ARCHITECTURE.md)
- [Database schema + domain model](docs/DATABASE.md)
- [REST API](docs/API.md)
- [User Stories + Backlog/Sprints](docs/BACKLOG.md)
- [Scaling, cost, monetization](docs/SCALING_COST_MONETIZATION.md)
- [UI screens](docs/UI.md)

## Quick start

```bash
# infra (db + backend)
docker compose -f infra/docker-compose.yml up -d
# backend locally
cd backend && ./mvnw spring-boot:run
# mobile
cd mobile && npm install && npx expo start
```
