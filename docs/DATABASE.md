# Schemat bazy danych + model domenowy

## Model domenowy
- **User** (aggregate root): tożsamość, ustawienia powiadomień, obserwowane spółki, historia czytań.
- **Company**: emitent GPW (ticker, ISIN, nazwa).
- **Report** (aggregate root): raport ESPI/EBI; należy do Company.
- **Watchlist**: relacja User↔Company.
- **ReadReceipt**: User przeczytał Report.

## ERD

```mermaid
erDiagram
  users ||--o{ watchlist : has
  companies ||--o{ watchlist : tracked
  companies ||--o{ reports : issues
  users ||--o{ read_receipts : marks
  reports ||--o{ read_receipts : read
  users ||--|| notification_settings : configures

  users { uuid id PK; string email; string password_hash; string provider; timestamptz created_at }
  companies { uuid id PK; string ticker; string isin; string name }
  reports { uuid id PK; uuid company_id FK; string external_id; string type; string number; string title; text body; timestamptz published_at }
  watchlist { uuid user_id FK; uuid company_id FK; timestamptz added_at }
  read_receipts { uuid user_id FK; uuid report_id FK; timestamptz read_at }
  notification_settings { uuid user_id PK; string mode; string fcm_token; bool keywords_enabled }
```

## DDL (skrót)
```sql
CREATE TABLE companies (id uuid PRIMARY KEY, ticker varchar(16) UNIQUE, isin varchar(16), name varchar(255));
CREATE TABLE reports (id uuid PRIMARY KEY, company_id uuid REFERENCES companies(id),
  external_id varchar(64) UNIQUE, type varchar(8), number varchar(32), title text, body text,
  published_at timestamptz, INDEX idx_pub (published_at DESC));
CREATE TABLE users (id uuid PRIMARY KEY, email varchar(255) UNIQUE, password_hash text, provider varchar(16));
CREATE TABLE watchlist (user_id uuid, company_id uuid, added_at timestamptz, PRIMARY KEY(user_id,company_id));
CREATE TABLE read_receipts (user_id uuid, report_id uuid, read_at timestamptz, PRIMARY KEY(user_id,report_id));
```
Partycjonowanie `reports` po `published_at` (miesięczne) dla skali.
