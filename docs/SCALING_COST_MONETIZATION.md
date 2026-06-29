# Skalowanie, koszty, monetyzacja

## Skalowanie
| Użytkownicy | Backend | DB | Cache | Push |
|---|---|---|---|---|
| 10k | 2× pod (1vCPU) | 1 PG (2vCPU) | Redis 1GB | FCM batch |
| 50k | 4–6 pod HPA | PG + read replica | Redis 4GB | digest queue |
| 100k | 8–12 pod HPA, ingestion oddzielnie | PG partycje + 2 repliki | Redis cluster | sharded topics |

Klucze: feed z kursorem + cache, partycjonowanie `reports`, ingestion jako osobny worker, CDN dla treści statycznych.

## Koszty (mies., szac. EUR)
- 10k: ~120–180 (1 mały klaster, 1 DB).
- 50k: ~400–600 (HPA, replika, Redis).
- 100k: ~900–1400 (cluster, partycje, monitoring).

## Monetyzacja
- **Free:** 5 spółek, digest.
- **Pro (19,99 zł/mc):** nielimitowane spółki, push immediate, alerty słów kluczowych.
- **Pro+ (39,99 zł/mc):** AI summary + sentyment, ranking, eksport.
- B2B API dla domów maklerskich.
