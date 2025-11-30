const fp = require('fastify-plugin');
const fastifyOauth2 = require('@fastify/oauth2');
const { loadEnv } = require('../config/env');

const env = loadEnv();

module.exports = fp(async function oauth2Plugin(fastify) {
  fastify.register(fastifyOauth2, {
    name: 'googleOAuth2',
    scope: ['profile', 'email'],
    credentials: {
      client: {
        id: env.GOOGLE_CLIENT_ID,
        secret: env.GOOGLE_CLIENT_SECRET
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION
    },
    startRedirectPath: '/api/auth/google',
    callbackUri: env.GOOGLE_REDIRECT_URI
  });
});