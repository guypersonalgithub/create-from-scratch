import { Client, Pool } from "pg";

type InitializationProperties = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export const initializeClient = ({
  host,
  port,
  user,
  password,
  database,
}: InitializationProperties) => {
  const client = new Client({
    host,
    port,
    user,
    password,
    database,
  });

  return client;
};

export const initializePool = ({
  host,
  port,
  user,
  password,
  database,
}: InitializationProperties) => {
  const pool = new Pool({
    host,
    port,
    user,
    password,
    database,
  });

  return pool;
};
