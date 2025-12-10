const USER_NOT_PROVISIONED_ERROR = 'USER_NOT_PROVISIONED';

async function syncExistingGoogleUser(fastify, profile) {
  const client = await fastify.pg.pool.connect();
  try {
    const { rows } = await client.query(
      `
      UPDATE users
      SET google_sub = COALESCE(google_sub, $1),
          email = $2,
          name = $3,
          picture = $4
      WHERE google_sub = $1 OR email = $2
      RETURNING id, email, name, picture, role
      `,
      [profile.googleSub, profile.email, profile.name, profile.picture]
    );

    if (!rows.length) {
      const err = new Error(USER_NOT_PROVISIONED_ERROR);
      err.code = USER_NOT_PROVISIONED_ERROR;
      throw err;
    }

    return rows[0];
  } finally {
    client.release();
  }
}

/*
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  google_sub TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  picture TEXT,
  role TEXT NOT NULL DEFAULT 'staff',
  created_at TIMESTAMPTZ DEFAULT now()
);
*/

module.exports = { syncExistingGoogleUser, USER_NOT_PROVISIONED_ERROR };