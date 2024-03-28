import { readFileSync } from "fs";
import { Pool } from "pg";
import { baseDockerPathHelper } from "./utils";

type CreateUsersTableArgs = {
  pool: Pool;
};

export const createTables = async ({ pool }: CreateUsersTableArgs) => {
  const client = await pool.connect();
  const query = readFileSync(
    `${baseDockerPathHelper}/queries/tableCreation.sql`,
    {
      encoding: "utf-8",
    }
  );

  try {
    const res = await client.query(query);
    return res.rows;
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};
