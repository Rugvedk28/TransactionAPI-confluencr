# Assumptions

- PostgreSQL 16 is the reference database. The `pg` repository layer keeps HTTP and business code free of SQL, but moving to MySQL/SQLite requires revisiting migrations, `FOR UPDATE`, error code `23505`, UUID support, and lock semantics.
- IDs are server-generated UUIDs. Timestamps are PostgreSQL `TIMESTAMPTZ`, serialized as ISO-8601 UTC.
- This ledger is one two-decimal currency. Amounts are decimal JSON strings (`0.01`–`999999999999.99`), represented as integer cents in JavaScript `BigInt` and PostgreSQL `BIGINT`; no rounding occurs.
- `CREDIT` and `DEBIT` are the only types. `(account_id, reference_id)` is unique. Repeats return 409 rather than replaying a prior response.
- Insufficient funds return 409. History pages are zero-indexed, default to 10, and cap at 100. Equal timestamps break ties by transaction UUID descending.
- Ledger rows have no mutation routes. This is application-level immutability; a database owner can still issue SQL updates. Production hardening can add revoke privileges/audit triggers.
- Accounts are not deletable through this API; foreign keys also restrict deletion with ledger history. Authentication/authorization and multi-currency are out of scope.
- Each transaction locks one account with PostgreSQL `SELECT ... FOR UPDATE`. This is the basis for the stated concurrency guarantees.
