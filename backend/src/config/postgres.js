const { Pool } = require('pg');
const { loadEnv } = require('./env');

const env = loadEnv();

const pool = new Pool({
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  max: 15
});

module.exports = { pool };