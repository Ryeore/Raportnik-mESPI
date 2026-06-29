# System architecture

## 1. Overview

Raportnik is a distributed system based on Clean Architecture + DDD. The backend uses CQRS (separating writes from reads) and the Repository Pattern. Data ingestion from PAP is done through a swappable `ReportIngestionSource` (scraper → API).

## 2. Component diagram

```mermaid
graph TD
  subgraph Client
    M[React Native Expo App]
  end
  subgraph Edge
    GW[API Gateway / Ingress]
  end
  subgraph Backend["Spring Boot 3"]
    AUTH[Auth Service - OAuth2/JWT]
    QRY[Query API - feed/companies]
    CMD[Command API - watchlist/read]
    ING[Ingestion Worker - scraper PAP]
    NOTIF[Notification Service - FCM]
  end
  PG[(PostgreSQL)]
  REDIS[(Redis cache/queue)]
  PAP[espiebi.pap.pl]
  FCM[Firebase Cloud Messaging]

  M --> GW --> AUTH
  GW --> QRY
  GW --> CMD
  ING --> PAP
  ING --> PG
  ING --> NOTIF --> FCM --> M
  QRY --> PG
  QRY --> REDIS
  CMD --> PG
  AUTH --> PG
```

## 3. Layers (Clean Architecture)

```
domain        -> entities, aggregates, rules (zero dependencies)
application   -> use cases, CQRS handlers, ports (interfaces)
infrastructure-> JPA repositories, scraper, FCM, security
api           -> REST controllers, DTOs, mappers
```

Dependencies point inward: `api -> application -> domain`, `infrastructure` implements ports from `application`.

## 4. Ingestion + push flow

```mermaid
sequenceDiagram
  ING->>PAP: fetch ESPI/EBI (cron)
  PAP-->>ING: new reports
  ING->>PG: save (dedup by external_id)
  ING->>NOTIF: new report for followers
  NOTIF->>FCM: push (immediate / digest)
  FCM-->>M: notification
```

## 5. Reliability
- Retry with backoff + dead-letter for ingestion.
- Idempotency by `external_id`.
- Monitoring: Actuator + Prometheus + Grafana; JSON logs to Loki.
