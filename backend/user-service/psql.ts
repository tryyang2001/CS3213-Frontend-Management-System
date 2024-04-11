import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool =
  process.env.NODE_ENV === "test"
    ? new Pool()
    : new Pool({
        host: process.env.PSQL_HOSTNAME,
        database: process.env.PSQL_DATABASE,
        user: process.env.PSQL_USERNAME,
        password: process.env.PSQL_PASSWORD,
        port: parseInt(process.env.PSQL_PORT || "5432"),
      });

const createUserTableQueryIfNotExist = `
        CREATE SCHEMA IF NOT EXISTS users;
        CREATE TABLE IF NOT EXISTS users."User" (
            uid SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            major VARCHAR(255) NOT NULL,
            course VARCHAR(255),
            password VARCHAR(255) NOT NULL,
            role VARCHAR(60) NOT NULL
        );
  `;

pool.query(createUserTableQueryIfNotExist).catch((err) => {
  console.error("Error creating table:", err);
});

pool
  .connect()
  .then(() => console.log("Connected to the user microservice psql database"))
  .catch((err) =>
    console.error("Error connecting to the user microservce database", err)
  );

export default pool;
