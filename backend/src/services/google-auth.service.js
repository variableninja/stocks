const { OAuth2Client } = require('google-auth-library');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { loadEnv } = require('../config/env');

const env = loadEnv();
const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const googleProfileStrategy = new GoogleStrategy(
    {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_REDIRECT_URI
    },
    (_, __, profile, done) => done(null, profile)
);

passport.use('google-profile-fetch', googleProfileStrategy);

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

// web: obtém userinfo usando passport
async function fetchGoogleUserInfo(accessToken) {
    return new Promise((resolve, reject) => {
        googleProfileStrategy.userProfile(accessToken, (err, profile) => {
            if (err) {
                return reject(new Error(`Failed to fetch Google user info via passport - ${err.message}`));
            }

            if (!profile?.id) {
                return reject(new Error('GOOGLE_PROFILE_EMPTY'));
            }

            resolve({
                googleSub: profile.id,
                email: profile.emails?.[0]?.value,
                name: profile.displayName,
                picture: profile.photos?.[0]?.value
            });
        });
    });
}

module.exports = { verifyGoogleIdToken, fetchGoogleUserInfo };