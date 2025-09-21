import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.ts';

// Ensure the environment variable is defined
if (!process.env.SHOES_SHOP_API_DATABASE_URL) {
  throw new Error('SHOES_SHOP_API_DATABASE_URL is not set in .env');
}

// Initialize postgres-js client
const client = postgres(process.env.SHOES_SHOP_API_DATABASE_URL);

// Initialize Drizzle ORM with schema and logging
export  default drizzle(client, { schema, logger: true });