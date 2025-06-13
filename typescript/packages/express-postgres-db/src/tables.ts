import { type Pool } from "pg";

type CreateUsersTableArgs = {
  pool: Pool;
};

export const createTables = async ({ pool }: CreateUsersTableArgs) => {
  const client = await pool.connect();
  const query = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tests (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      test BOOLEAN NOT NULL
    );`;

  try {
    const res = await client.query(query);

    return res.rows;
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};
