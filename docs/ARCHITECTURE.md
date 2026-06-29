# Architektura systemu

## 1. Przegląd

Raportnik to system rozproszony oparty o Clean Architecture + DDD. Backend stosuje CQRS (oddzielenie zapisu od odczytu) i Repository Pattern. Pozyskiwanie danych z PAP odbywa się przez wymienialny `ReportIngestionSource` (scraper → API).

## 2. Diagram komponentów

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

## 3. Warstwy (Clean Architecture)

```
domain        -> encje, agregaty, reguły (zero zależności)
application   -> use-case'y, CQRS handlers, porty (interfejsy)
infrastructure-> repozytoria JPA, scraper, FCM, security
api           -> kontrolery REST, DTO, mappery
```

Zależności kierowane do środka: `api -> application -> domain`, `infrastructure` implementuje porty z `application`.

## 4. Przepływ ingestion + push

```mermaid
sequenceDiagram
  ING->>PAP: fetch ESPI/EBI (cron)
  PAP-->>ING: nowe raporty
  ING->>PG: zapis (dedup po external_id)
  ING->>NOTIF: nowy raport dla obserwujących
  NOTIF->>FCM: push (immediate / digest)
  FCM-->>M: powiadomienie
```

## 5. Niezawodność
- Retry z backoff + dead-letter dla ingestion.
- Idempotencja po `external_id`.
- Monitoring: Actuator + Prometheus + Grafana; logi JSON do Loki.
