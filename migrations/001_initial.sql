CREATE TABLE IF NOT EXISTS schema_migrations (
  name TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  name VARCHAR(120) NOT NULL CHECK (btrim(name) <> ''),
  balance BIGINT NOT NULL DEFAULT 0 CHECK (balance >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  type VARCHAR(6) NOT NULL CHECK (type IN ('CREDIT', 'DEBIT')),
  amount BIGINT NOT NULL CHECK (amount > 0),
  description VARCHAR(500) NOT NULL,
  reference_id VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT transactions_account_reference_unique UNIQUE (account_id, reference_id)
);

CREATE INDEX transactions_account_created_id_idx
  ON transactions (account_id, created_at DESC, id DESC);
CREATE INDEX transactions_account_type_created_id_idx
  ON transactions (account_id, type, created_at DESC, id DESC);
