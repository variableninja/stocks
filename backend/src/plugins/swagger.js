const fp = require('fastify-plugin');
const swagger = require('@fastify/swagger');
const swaggerUi = require('@fastify/swagger-ui');

module.exports = fp(async function swaggerPlugin(fastify) {
  fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Stocks API',
        version: '1.0.0'
      },
      servers: [
        { url: 'https://stocks.madeofyoutickets.com/api' },
        { url: 'http://localhost:8080/api' }
      ]
    }
  });

  fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list', deepLinking: false }
  });
});