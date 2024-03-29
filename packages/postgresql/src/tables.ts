import { readFileSync } from "fs";
import { Client, Pool, PoolClient } from "pg";
import { baseDockerPathHelper } from "./utils";

type GetAllPublicTablesListArgs =
  | {
      client: Client;
      pool?: never;
    }
  | { client?: never; pool: Pool };

type PostgresTableProperties = {
  table_name: string;
  column_name: string;
  data_type: string;
};

export const getAllPublicTablesList = async ({
  client,
  pool,
}: GetAllPublicTablesListArgs) => {
  if (client) {
    try {
      await client.connect();
      const query = readFileSync(
        `${baseDockerPathHelper}/queries/publicTables.sql`,
        {
          encoding: "utf-8",
        }
      );

      const res = await client.query<PostgresTableProperties>(query);
      return res.rows;
    } catch (error) {
      throw error;
    }
  }

  let connection: PoolClient | undefined;

  try {
    connection = await pool.connect();
    const query = readFileSync(
      `${baseDockerPathHelper}/queries/publicTables.sql`,
      {
        encoding: "utf-8",
      }
    );

    const res = await connection.query<PostgresTableProperties>(query);
    return res.rows;
  } catch (error) {
    console.log(error);
  } finally {
    connection?.release();
  }

  return [];
};
