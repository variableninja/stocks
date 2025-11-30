const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const { loadEnv } = require('../config/env');

const env = loadEnv();
const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

// mobile: verifica idToken do Google (React Native)
async function verifyGoogleIdToken(idToken) {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    return {
        googleSub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
    };
}

// web: obtém userinfo usando access_token (OAuth2)
async function fetchGoogleUserInfo(accessToken) {
    const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(
            `Failed to fetch Google user info: ${res.status} ${res.statusText} – ${body}`
        );
    }

    const payload = await res.json();
    return {
        googleSub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
    };
}

module.exports = { verifyGoogleIdToken, fetchGoogleUserInfo };