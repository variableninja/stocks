async function upsertGoogleUser(fastify, profile) {
  const client = await fastify.pg.pool.connect();
  try {
    const { rows } = await client.query(
      `
      INSERT INTO users (google_sub, email, name, picture)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (google_sub)
      DO UPDATE SET email = EXCLUDED.email,
                    name = EXCLUDED.name,
                    picture = EXCLUDED.picture
      RETURNING id, email, name, picture, role
      `,
      [profile.googleSub, profile.email, profile.name, profile.picture]
    );
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

module.exports = { upsertGoogleUser };