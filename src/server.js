import { createApp } from './app.js';
import { env } from './config/env.js';
import { pool } from './config/database.js';
const server = createApp().listen(env.port, () => console.log(`Ledger API listening on :${env.port}`));
const shutdown = () => server.close(() => pool.end().finally(() => process.exit(0)));
process.on('SIGTERM', shutdown); process.on('SIGINT', shutdown);
