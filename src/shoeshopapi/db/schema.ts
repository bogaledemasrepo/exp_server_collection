import { pgTable, varchar,uuid,text,decimal, timestamp, date, pgEnum, integer } from "drizzle-orm/pg-core";

export const UserRole=pgEnum("userRole",["ADMIN","CUSTOMER"]);
export const OrderStatus=pgEnum("orderStatus",["ORDERED","SHIPPED","DELIVERED"]);

export const UsersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avator:varchar("avator",{ length: 255 }),
  password:varchar({length:255}).notNull(),
  role:UserRole("userRole").default("CUSTOMER"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const ShoesTable = pgTable("shoes", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  brand: varchar({ length: 255 }).notNull(),
  category: varchar({ length: 255 }).notNull(),
  discription: text(),
  image:text().notNull(),
  quantity:integer().notNull(),
  soldout:integer().notNull().default(0),
  unitPrice:decimal().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const ProfileTable = pgTable("profile", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  birthDate:date().notNull(),
  photos:text().array(),
  userId:uuid("userId").references(()=>UsersTable.id).notNull()
});


export const OrderTable = pgTable("orders", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  orderDate:date().notNull(),
  userId:uuid("userId").references(()=>UsersTable.id).notNull(),
  status:OrderStatus().default("ORDERED").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const OrderItemTable = pgTable("orderItems", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  orderId:uuid("orderId").references(()=>OrderTable.id).notNull(),
  shoesId:uuid("shoesId").references(()=>ShoesTable.id).notNull(),
  quantity:integer().notNull().default(1)
});