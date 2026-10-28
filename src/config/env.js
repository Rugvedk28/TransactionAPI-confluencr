import 'dotenv/config';

const required = ['DATABASE_URL'];
for (const key of required) if (!process.env[key]) throw new Error(`${key} is required`);

export const env = Object.freeze({
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL,
  databaseSsl: process.env.DATABASE_SSL === 'true',
  nodeEnv: process.env.NODE_ENV || 'development'
});
