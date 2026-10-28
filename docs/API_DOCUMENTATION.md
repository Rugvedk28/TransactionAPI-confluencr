# API reference

All responses are JSON. Failures use `{ timestamp, status, error, message, path }`; validation failures also include Zod field details. Monetary inputs and outputs are strings with exactly two decimals.

## `POST /api/v1/accounts`

Creates an account. Body: `{ "name": "Rugved Kulkarni" }`; no other fields are accepted. Returns 201 with `{ id, name, balance: "0.00", created_at }`. A blank/over-120-character name or client `balance` returns 400.

## `GET /api/v1/accounts/:accountId/balance`

Returns 200 `{ account_id, balance }`; the UUID must be valid. A missing account returns 404.

## `POST /api/v1/accounts/:accountId/transactions`

Creates an immutable ledger entry. Example:

```json
{ "type":"CREDIT", "amount":"500.00", "description":"Salary", "reference_id":"salary-oct-2026" }
```

Returns 201 with `{ id, account_id, type, amount, description, reference_id, created_at, balance_after }`. `type` is `CREDIT` or `DEBIT`; amount must be positive and have two fractional digits; description is at most 500 characters; reference ID is nonblank and at most 120 characters. It returns 404 for no account, 409 `INSUFFICIENT_BALANCE` for an unaffordable debit, and 409 `DUPLICATE_REFERENCE` if that account has already used the reference. A reference can be reused on a different account. Duplicate protection is at-least-once processing protection, not exactly-once network delivery.

## `GET /api/v1/accounts/:accountId/transactions`

Returns 200 `{ account_id, transactions, pagination }`. Optional `type=CREDIT|DEBIT`, zero-based `page` (default 0), and `limit` (default 10, 1–100) are validated. Results are latest-first, then UUID descending for deterministic ties. Unknown accounts return 404; bad query values return 400. Filtering, count, ordering, and paging run in PostgreSQL.

No transaction PATCH, PUT, or DELETE route exists. The OpenAPI 3.0 document is served through Swagger UI at `/docs`.
