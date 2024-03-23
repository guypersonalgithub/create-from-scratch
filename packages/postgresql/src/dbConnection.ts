import { Client, Pool } from "pg";

const host = "postgresql";
const port = 5432;
const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const database = process.env.POSTGRES_DB;

export const initializeClient = () => {
  const client = new Client({
    host,
    port,
    user,
    password,
    database,
  });

  return client;
};

export const initializePool = () => {
  const pool = new Pool({
    host,
    port,
    user,
    password,
    database,
  });

  return pool;
};
