CREATE TABLE companies (
  id uuid PRIMARY KEY,
  ticker varchar(16) UNIQUE NOT NULL,
  isin varchar(16),
  name varchar(255) NOT NULL
);
CREATE TABLE reports (
  id uuid PRIMARY KEY,
  company_id uuid REFERENCES companies(id),
  external_id varchar(64) UNIQUE NOT NULL,
  type varchar(8) NOT NULL,
  number varchar(32),
  title text NOT NULL,
  body text,
  published_at timestamptz NOT NULL
);
CREATE INDEX idx_reports_published ON reports (published_at DESC);
CREATE TABLE users (
  id uuid PRIMARY KEY,
  email varchar(255) UNIQUE NOT NULL,
  password_hash text,
  provider varchar(16) NOT NULL DEFAULT 'EMAIL'
);
CREATE TABLE watchlist (user_id uuid, company_id uuid, added_at timestamptz, PRIMARY KEY(user_id, company_id));
CREATE TABLE read_receipts (user_id uuid, report_id uuid, read_at timestamptz, PRIMARY KEY(user_id, report_id));
