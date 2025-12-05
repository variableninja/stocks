const authController = require('../controllers/auth.controller');

const userResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    email: { type: 'string', format: 'email' },
    role: { type: 'string' }
  },
  required: ['id', 'email', 'role']
};

const loginResponseSchema = {
  type: 'object',
  properties: {
    token: { type: 'string', description: 'JWT pronto a usar no header Authorization.' },
    user: userResponseSchema
  },
  required: ['token', 'user']
};

async function authRoutes(fastify) {
  // mobile: envia idToken do Google
  fastify.post('/google/mobile', {
      schema: {
        tags: ['auth'],
        summary: 'Login Google mobile',
        description: 'Endpoint para login via Google no app mobile, recebe o idToken do SDK do Google e devolve um JWT da API.',
        body: {
          type: 'object',
          required: ['idToken'],
          properties: {
            idToken: { type: 'string', description: 'ID token recebido do SDK do Google no app mobile.' }
          }
        },
        response: {
          200: loginResponseSchema,
          400: {
            description: 'Falta idToken no corpo da requisição.',
            type: 'object',
            properties: { error: { type: 'string' } }
          },
          401: {
            description: 'idToken inválido ou expirado.',
            type: 'object',
            properties: { error: { type: 'string' } }
          }
        }
      }
    },
    authController.googleMobileLogin(fastify)
  );

  // web: callback Google OAuth2
  fastify.get('/google/callback', {
    schema: {
      tags: ['auth'],
      summary: 'Callback Google OAuth2',
      description: 'Endpoint para callback do fluxo OAuth2 do Google para a versão web.',
      response: {
        302: {
          description: 'Redirect para o web app com o JWT na query string.'
        },
        401: {
          description: 'Erro no callback OAuth2 do Google.',
          type: 'object',
          properties: { error: { type: 'string' } }
        }
      }
    }
  }, authController.googleWebCallback(fastify));

  // teste auth via JWT
  fastify.get(
    '/me',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['auth'],
        summary: 'Perfil do utilizador atual',
        description: 'Devolve os dados do utilizador associado ao JWT usado na chamada.',
        security: [{ bearerAuth: [] }],
        response: {
          200: userResponseSchema,
          401: {
            description: 'JWT em falta ou fora do prazo.',
            type: 'object',
            properties: { error: { type: 'string' } }
          }
        }
      }
    },
    authController.me(fastify)
  );
}

module.exports = authRoutes;