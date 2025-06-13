import { type Client, type Pool, type PoolClient } from "pg";

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

export const getAllPublicTablesList = async ({ client, pool }: GetAllPublicTablesListArgs) => {
  if (client) {
    try {
      await client.connect();
      const query = `SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public';`;

      const res = await client.query<PostgresTableProperties>(query);

      return res.rows;
    } catch (error) {
      throw error;
    }
  }

  let connection: PoolClient | undefined;

  try {
    connection = await pool.connect();
    const query = `SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public';`;

    const res = await connection.query<PostgresTableProperties>(query);

    return res.rows;
  } catch (error) {
    console.log(error);
  } finally {
    connection?.release();
  }

  return [];
};
