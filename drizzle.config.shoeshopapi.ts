import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/shoeshopapi/db/schema.ts',
  out: './drizzle/migrations/shoeshopapi',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SHOES_SHOP_API_DATABASE_URL!,
  },
});