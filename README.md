# Transaction Ledger API

A PostgreSQL-backed REST ledger built with Node.js, Express, `pg`, Zod, and Swagger UI. It keeps a denormalized, persisted account balance synchronized with immutable ledger entries through one database transaction.

## Quick start

Prerequisites: Node 20+ and PostgreSQL 16+ (or Docker). Copy `.env.example` to `.env`, set `DATABASE_URL`, then run:

```sh
npm install
npm run migrate
npm start
```

Alternatively, `docker compose up --build` starts PostgreSQL, migrates, and serves the API at `http://localhost:3000`. Health is at `/health`; interactive Swagger UI is at `/docs`.

Run unit tests with `npm test`. With a reachable, migrated PostgreSQL database, run integration tests with `RUN_INTEGRATION_TESTS=true npm run test:integration`.

## Endpoints

`POST /api/v1/accounts`, `GET /api/v1/accounts/:accountId/balance`, `POST /api/v1/accounts/:accountId/transactions`, `GET /api/v1/accounts/:accountId/transactions`, and `POST /api/v1/transfers`.

See [API reference](docs/API_DOCUMENTATION.md), [architecture](docs/ARCHITECTURE.md), [assumptions](docs/ASSUMPTIONS.md), and the [learning guide](docs/LEARNING_GUIDE.md). PostgreSQL is required for the documented locking guarantees. The unit and PostgreSQL integration test suites pass. Integration tests cover account creation, credit/debit operations, duplicate references, insufficient funds, concurrent debits, transaction history, and transfers.
