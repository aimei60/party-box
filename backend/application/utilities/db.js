// connects express to postgresal and lets the db to be used globally
import pkg from "pg"

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default pool;