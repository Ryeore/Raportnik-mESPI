# Raportnik

Aplikacja mobilna do monitorowania raportów **ESPI/EBI** spółek notowanych na GPW.
Użytkownik otrzymuje w czasie rzeczywistym raporty wybranych spółek oraz wygodnie je filtruje i przegląda.

> Źródło danych: https://espiebi.pap.pl/ (start: scraper, docelowo: oficjalne API). Warstwa pobierania jest abstrahowana, więc zmiana źródła nie wymaga zmian w domenie.

## Stack

| Warstwa | Technologia |
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
├── docs/           # Architektura, DB, API, backlog, skalowanie, koszty, monetyzacja
├── infra/          # docker-compose, k8s manifests
└── .github/        # CI/CD
```

## Dokumentacja

- [Architektura systemu + diagramy](docs/ARCHITECTURE.md)
- [Schemat bazy danych + model domenowy](docs/DATABASE.md)
- [REST API](docs/API.md)
- [User Stories + Backlog/Sprinty](docs/BACKLOG.md)
- [Skalowanie, koszty, monetyzacja](docs/SCALING_COST_MONETIZATION.md)
- [Ekrany UI](docs/UI.md)

## Szybki start

```bash
# infra (db + backend)
docker compose -f infra/docker-compose.yml up -d
# backend lokalnie
cd backend && ./mvnw spring-boot:run
# mobile
cd mobile && npm install && npx expo start
```
