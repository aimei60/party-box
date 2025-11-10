// connects express to postgresal and lets my db be used globally

import dotenv from "dotenv"
import pkg from "pg"

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default pool;