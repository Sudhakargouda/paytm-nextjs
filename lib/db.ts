import mysql, { Connection } from 'mysql2/promise';

export async function createConnection(): Promise<Connection> {
  return await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'sudhakargouda',
    password: process.env.DB_PASSWORD || 'patil',
    database: process.env.DB_NAME || 'paytmnextmysql',
  });
}
