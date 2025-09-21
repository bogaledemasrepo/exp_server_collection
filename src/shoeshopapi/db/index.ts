import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "./schema.ts"
export default drizzle(process.env.DATABASE_URL!,{schema});

// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/node-postgres';
// import * as schema from "./schema.ts"
// import postgres from 'postgres'
// const client = postgres(process.env.SHOES_SHOP_API_DATABASE_URL as string)
// const  db= drizzle(client,,{schema,logger:true});