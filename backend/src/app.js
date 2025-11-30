const fastifyFactory = require('fastify');
const { loadEnv } = require('./config/env');

const postgresPlugin = require('./plugins/postgres');
const redisPlugin = require('./plugins/redis');
const jwtPlugin = require('./plugins/jwt');
const swaggerPlugin = require('./plugins/swagger');
const oauth2Plugin = require('./plugins/oauth2');
const routes = require('./routes');

const env = loadEnv();

function buildApp() {
  const fastify = fastifyFactory({ logger: true });

  fastify.register(require('@fastify/cors'), {
    origin: env.CORS_ORIGINS.split(',').map((s) => s.trim()),
    credentials: true
  });

  fastify.register(postgresPlugin);
  fastify.register(redisPlugin);
  fastify.register(jwtPlugin);
  fastify.register(swaggerPlugin);
  fastify.register(oauth2Plugin);

  fastify.register(routes, { prefix: '/api' });

  return fastify;
}

module.exports = { buildApp };