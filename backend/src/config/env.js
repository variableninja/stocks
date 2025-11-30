const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
  path: path.resolve(__dirname, '../../../.env')
});

function loadEnv() {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 8080,

    POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
    POSTGRES_PORT: Number(process.env.POSTGRES_PORT) || 5432,
    POSTGRES_USER: process.env.POSTGRES_USER || 'moy',
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || '',
    POSTGRES_DB: process.env.POSTGRES_DB || 'stocks',

    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,

    CORS_ORIGINS: process.env.CORS_ORIGINS || 'http://localhost:3000',
    WEB_APP_URL: process.env.WEB_APP_URL || 'http://localhost:3000'
  };
}

module.exports = { loadEnv };