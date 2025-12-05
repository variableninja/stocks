const {
    verifyGoogleIdToken,
    fetchGoogleUserInfo
} = require('../services/google-auth.service');
const userService = require('../services/user.service');
const { loadEnv } = require('../config/env');

const env = loadEnv();

function googleMobileLogin(fastify) {
    return async function handler(request, reply) {
        const { idToken } = request.body;
        if (!idToken) {
            return reply.code(400).send({ error: 'MISSING_ID_TOKEN' });
        }

        try {
            const profile = await verifyGoogleIdToken(idToken);
            const user = await userService.upsertGoogleUser(fastify, profile);

            const token = fastify.jwt.sign({
                sub: user.id,
                email: user.email,
                role: user.role
            });

            reply.send({ token, user });
        } catch (err) {
            fastify.log.error(err);
            reply.code(401).send({ error: 'INVALID_GOOGLE_TOKEN' });
        }
    };
}

function googleWebCallback(fastify) {
    return async function handler(request, reply) {
        try {
            const { token: oauthToken } = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
                request
            );

            if (!oauthToken?.access_token) {
                throw new Error('GOOGLE_OAUTH_NO_ACCESS_TOKEN');
            }

            const profile = await fetchGoogleUserInfo(oauthToken.access_token);
            const user = await userService.upsertGoogleUser(fastify, profile);

            const jwt = fastify.jwt.sign({
                sub: user.id,
                email: user.email,
                role: user.role
            });

            // redireciona para o web app com o token na query
            const redirectUrl = `${env.WEB_APP_URL}/auth/callback?token=${encodeURIComponent(
                jwt
            )}`;

            reply.redirect(redirectUrl);
        } catch (err) {
            fastify.log.error(err);
            reply.code(401).send({ error: 'OAUTH2_CALLBACK_ERROR' });
        }
    };
}

function me(fastify) {
    return async function handler(request, reply) {
        reply.send({
            id: request.user.sub,
            email: request.user.email,
            role: request.user.role
        });
    };
}

module.exports = { googleMobileLogin, googleWebCallback, me };