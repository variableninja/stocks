const authController = require('../controllers/auth.controller');

async function authRoutes(fastify) {
  // mobile: envia idToken do Google
  fastify.post('/google/mobile', authController.googleMobileLogin(fastify));

  // web: callback Google OAuth2
  fastify.get('/google/callback', authController.googleWebCallback(fastify));

  // teste auth via JWT
  fastify.get(
    '/me',
    { preHandler: [fastify.authenticate] },
    authController.me(fastify)
  );
}

module.exports = authRoutes;