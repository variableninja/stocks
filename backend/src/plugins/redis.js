const fp = require('fastify-plugin');
const { redisClient } = require('../config/redis');

module.exports = fp(async function redisPlugin(fastify) {
  fastify.decorate('redis', redisClient);
});