import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pool } from '../src/config/database.js';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../migrations');
const files = (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort();
try {
  await pool.query('CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');
  for (const name of files) {
    const seen = await pool.query('SELECT 1 FROM schema_migrations WHERE name = $1', [name]);
    if (seen.rowCount) continue;
    const client = await pool.connect();
    try { await client.query('BEGIN'); await client.query(await readFile(path.join(dir, name), 'utf8')); await client.query('INSERT INTO schema_migrations(name) VALUES ($1)', [name]); await client.query('COMMIT'); console.log(`Applied ${name}`); }
    catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
  }
} finally { await pool.end(); }
