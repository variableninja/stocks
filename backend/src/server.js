const { buildApp } = require('./app');
const { loadEnv } = require('./config/env');

const env = loadEnv();
const fastify = buildApp();

fastify
  .listen({ port: env.PORT, host: '0.0.0.0' })
  .then((address) => {
    fastify.log.info(`Stocks backend listening at ${address}`);
  })
  .catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });