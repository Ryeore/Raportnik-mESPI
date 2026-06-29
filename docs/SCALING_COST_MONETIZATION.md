# Scaling, cost, monetization

## Scaling
| Users | Backend | DB | Cache | Push |
|---|---|---|---|---|
| 10k | 2× pod (1vCPU) | 1 PG (2vCPU) | Redis 1GB | FCM batch |
| 50k | 4–6 pod HPA | PG + read replica | Redis 4GB | digest queue |
| 100k | 8–12 pod HPA, ingestion oddzielnie | PG partycje + 2 repliki | Redis cluster | sharded topics |

Keys: cursor-based feed + cache, partition `reports`, ingestion as separate worker, CDN for static content.

## Cost (monthly, est. EUR)
- 10k: ~120–180 (1 small cluster, 1 DB).
- 50k: ~400–600 (HPA, replica, Redis).
- 100k: ~900–1400 (cluster, partitions, monitoring).

## Monetization
- **Free:** 5 companies, digest.
- **Pro (PLN 19.99/mo):** unlimited companies, immediate push, keyword alerts.
- **Pro+ (PLN 39.99/mo):** AI summary + sentiment, ranking, export.
- B2B API for brokerage houses.
