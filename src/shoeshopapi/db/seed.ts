import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { UsersTable, ShoesTable, ProfileTable, OrderTable, OrderItemTable, UserRole, OrderStatus } from "./schema.ts";
import type { InferInsertModel } from "drizzle-orm";

async function seed() {
  // Initialize database connection
  const pool = new Pool({
    connectionString: process.env.API1_DATABASE_URL,
  });
  const db = drizzle(pool);

  try {
    // Clear existing data (optional, comment out if not needed)
    await db.delete(OrderItemTable);
    await db.delete(OrderTable);
    await db.delete(ProfileTable);
    await db.delete(ShoesTable);
    await db.delete(UsersTable);

    // Seed UsersTable
    type UserInsert = InferInsertModel<typeof UsersTable>;
    const users = await db
      .insert(UsersTable)
      .values([
              {
                  name: "John Doe",
                  email: "john.doe@example.com",
                  avator: "https://example.com/avatars/john.jpg",
                  role: UserRole().default("ADMIN"),
              },
              {
                  name: "Jane Smith",
                  email: "jane.smith@example.com",
                  avator: "https://example.com/avatars/jane.jpg",
                  role: UserRole().default("CUSTOMER"),
              },
              {
                  name: "Bob Johnson",
                  email: "bob.johnson@example.com",
                  avator: "https://example.com/avatars/bob.jpg",
                  role: UserRole().default("CUSTOMER"),
              },
          ] as unknown as UserInsert[])
      .returning({ id: UsersTable.id });

    const userIds = users.map((user) => user.id).filter((id): id is string => id !== undefined);

    // Seed ShoesTable
    type ShoeInsert = InferInsertModel<typeof ShoesTable>;
    const shoes = await db
      .insert(ShoesTable)
      .values([
        {
          brand: "Nike",
          category: "Running",
          discription: "Comfortable running shoes with Air Max cushioning",
          quantity: 100,
          soldout: 10,
          unitPrice: "120.00",
        },
        {
          brand: "Adidas",
          category: "Casual",
          discription: "Stylish casual sneakers",
          quantity: 50,
          soldout: 5,
          unitPrice: "80.00",
        },
        {
          brand: "Puma",
          category: "Sports",
          discription: "High-performance sports shoes",
          quantity: 75,
          soldout: 15,
          unitPrice: "95.00",
        },
      ] as ShoeInsert[])
      .returning({ id: ShoesTable.id });

    const shoeIds = shoes.map((shoe) => shoe.id).filter((id): id is string => id !== undefined);

    // Seed ProfileTable
    type ProfileInsert = InferInsertModel<typeof ProfileTable>;
    await db
      .insert(ProfileTable)
      .values([
        {
          birthDate: "1990-05-15",
          photos: ["https://example.com/photos/john1.jpg", "https://example.com/photos/john2.jpg"],
          userId: userIds[0],
        },
        {
          birthDate: "1995-08-22",
          photos: ["https://example.com/photos/jane1.jpg"],
          userId: userIds[1],
        },
        {
          birthDate: "1988-03-10",
          photos: [],
          userId: userIds[2],
        },
      ] as ProfileInsert[]);

    // Seed OrderTable
    type OrderInsert = InferInsertModel<typeof OrderTable>;
    const orders = await db
      .insert(OrderTable)
      .values([
        {
          orderDate: "2025-09-20",
          userId: userIds[1],
          status: OrderStatus.enumValues[0],
        },
        {
          orderDate: "2025-09-19",
          userId: userIds[2],
          status: OrderStatus.enumValues[0],
        },
      ] as OrderInsert[])
      .returning({ id: OrderTable.id });

    const orderIds = orders.map((order) => order.id).filter((id): id is string => id !== undefined);

    // Seed OrderItemTable
    type OrderItemInsert = InferInsertModel<typeof OrderItemTable>;
    await db
      .insert(OrderItemTable)
      .values([
        {
          orderId: orderIds[0],
          shoesId: shoeIds[0],
          quantity: 2,
        },
        {
          orderId: orderIds[0],
          shoesId: shoeIds[1],
          quantity: 1,
        },
        {
          orderId: orderIds[1],
          shoesId: shoeIds[2],
          quantity: 3,
        },
      ] as OrderItemInsert[]);

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await pool.end();
  }
}

seed();