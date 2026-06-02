import { Pool } from 'pg';

async function testConnection() {
  if (!process.env.FAST_ECCOMERCE_API_DATABASE_URL) {
    throw new Error('FAST_ECCOMERCE_API_DATABASE_URL is not set in .env');
  }

  const pool = new Pool({
    connectionString: process.env.FAST_ECCOMERCE_API_DATABASE_URL,
  });

  try {
    const client = await pool.connect();
    console.log(client);
    console.log('Connected to database successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('Current time:', res.rows[0]);
    client.release();
  } catch (error) {
    console.error('Connection error:', error);
  } finally {
    await pool.end();
  }
}

testConnection();
