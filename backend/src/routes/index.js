const authRoutes = require('./auth.routes');

async function routes(fastify) {
  fastify.register(authRoutes, { prefix: '/auth' });
}

module.exports = routes;