const fp = require('fastify-plugin');
const { pool } = require('../config/postgres');

module.exports = fp(async function postgresPlugin(fastify) {
  fastify.decorate('pg', {
    query: (text, params) => pool.query(text, params),
    pool
  });
});