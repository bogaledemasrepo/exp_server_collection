import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.FAST_ECCOMERCE_API_DATABASE_URL) {
  throw new Error("FAST_ECCOMERCE_API_DATABASE_URL is not set in .env");
}

export default defineConfig({
  schema: './src/fasteccomerceapi/db/schema.ts',
  out: './drizzle/migrations/fasteccomerceapi',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.FAST_ECCOMERCE_API_DATABASE_URL!,
  },
});