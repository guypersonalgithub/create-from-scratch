import { Pool } from "pg";

type GetDateTimeArgs = {
  pool: Pool;
};

export const getDateTime = async ({ pool }: GetDateTimeArgs) => {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT NOW() as now;");
    return res.rows[0];
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};

// SELECT table_name FROM information_schema.tables WHERE table_schema='public'
