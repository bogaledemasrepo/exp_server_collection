import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.SHOES_SHOP_API_DATABASE_URL) {
  throw new Error("SHOES_SHOP_API_DATABASE_URL is not set in .env");
}

export default defineConfig({
  schema: './src/shoeshopapi/db/schema.ts',
  out: './drizzle/migrations/shoeshopapi',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SHOES_SHOP_API_DATABASE_URL!,
  },
});