import { pgTable, varchar,uuid,text,decimal, serial, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avator:varchar("avator",{ length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shoesTable = pgTable("shoes", {
  id: uuid().primaryKey(),
  brand: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
  discription: text(),
  unitPrice:decimal().notNull(),
});
