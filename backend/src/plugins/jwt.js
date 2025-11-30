const fp = require('fastify-plugin');
const fastifyJwt = require('@fastify/jwt');
const { loadEnv } = require('../config/env');

const env = loadEnv();

module.exports = fp(async function jwtPlugin(fastify) {
  fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET
  });

  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'UNAUTHORIZED' });
    }
  });
});