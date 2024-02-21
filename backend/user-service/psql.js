require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host     : process.env.PSQL_HOSTNAME,
    database : process.env.PSQL_database,
    user     : process.env.PSQL_USERNAME,
    password : process.env.PSQL_PASSWORD,
    port     : process.env.PSQL_PORT    
});

const createUserTableQueryIfNotExist = `
    DO $$ 
    BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_name = 'users'
        ) THEN
          CREATE TABLE users (
              email VARCHAR(255) PRIMARY KEY,
              username VARCHAR(255) NOT NULL,
              password VARCHAR(255) NOT NULL,
              role VARCHAR(60) NOT NULL
          );
        END IF;
    END $$;
  `;
  
pool.query(createUserTableQueryIfNotExist)
.catch((err) => {
    console.error('Error creating table:', err);
})

pool.connect()
    .then(() => console.log('Connected to the user microservice psql database'))
    .catch(err => console.error('Error connecting to the user microservce database', err));

module.exports = pool;