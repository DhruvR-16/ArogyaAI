// db.js
import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL || '';

const requireSsl = true; // Force SSL for Supabase

// Fix: Remove any accidental backticks from the connection string (e.g. postgre`s)
let cleanConnectionString = connectionString.replace('`', '');

// Fix: Add pgbouncer=true to disable prepared statements for Transaction Mode (Port 5432)
const hasQuery = cleanConnectionString.includes('?');
const finalConnectionString = cleanConnectionString.includes('pgbouncer=true') 
  ? cleanConnectionString 
  : `${cleanConnectionString}${hasQuery ? '&' : '?'}pgbouncer=true`;

const pool = new Pool({
  connectionString: finalConnectionString,
  connectionTimeoutMillis: process.env.NODE_ENV === 'production' ? 10000 : 20000,
  idleTimeoutMillis: 1000,
  max: 1,
  ssl: { rejectUnauthorized: false }
});

pool.on('connect', () => console.log('pg pool connected'));
pool.on('error', (err) => console.error('Unexpected pg pool error', err));

export default pool;
