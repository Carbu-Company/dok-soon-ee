// lib/mssql/pool.ts
import sql from "mssql";

let pool = null;

async function getPool() {
  if (pool) return pool;
  pool = await new sql.ConnectionPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: { encrypt: true, trustServerCertificate: true },
    pool: { min: 1, max: 10, idleTimeoutMillis: 30000 },
  }).connect();
  return pool;
}

class Response {
  constructor(success, data, error) {
    this.success = success;
    this.data = data;
    this.error = error;
  }
}

export { getPool, Response };
