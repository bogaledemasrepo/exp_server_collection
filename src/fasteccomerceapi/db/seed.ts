import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import bcrypt from 'bcrypt';
import {
  UsersTable,
  ProductsTable,
  ProfileTable,
  OrderTable,
  OrderItemTable,
  UserRole,
  OrderStatus,
} from './schema.ts';
import type { InferInsertModel } from 'drizzle-orm';

if (!process.env.FAST_ECCOMERCE_API_DATABASE_URL) {
  throw new Error('FAST_ECCOMERCE_API_DATABASE_URL is not set in .env');
}

const client = postgres(process.env.FAST_ECCOMERCE_API_DATABASE_URL);
const db = drizzle(client, {
  schema: { UsersTable, ProductsTable, ProfileTable, OrderTable, OrderItemTable },
  logger: true,
});

async function seed() {
  try {
    // Clear existing data (optional, comment out if not needed)
    await db.delete(OrderItemTable);
    await db.delete(OrderTable);
    await db.delete(ProfileTable);
    await db.delete(ProductsTable);
    await db.delete(UsersTable);

    // Hash passwords
    const saltRounds = 10;
    const adminPassword = await bcrypt.hash('admin123', saltRounds);
    const customerPassword = await bcrypt.hash('customer123', saltRounds);

    // Seed UsersTable
    type UserInsert = InferInsertModel<typeof UsersTable>;
    const users = await db
      .insert(UsersTable)
      .values([
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          avator: 'https://example.com/avatars/john.jpg',
          password: adminPassword,
          role: 'ADMIN',
        },
        {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          avator: 'https://example.com/avatars/jane.jpg',
          password: customerPassword,
          role: 'CUSTOMER',
        },
        {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          avator: 'https://example.com/avatars/bob.jpg',
          password: customerPassword,
          role: 'CUSTOMER',
        },
      ] as UserInsert[])
      .returning({ id: UsersTable.id });

    const userIds = users
      .map((user) => user.id)
      .filter((id): id is string => id !== undefined);

    // Seed ProductsTable
    type ProductInsert = InferInsertModel<typeof ProductsTable>;
    const products = await db
      .insert(ProductsTable)
      .values([
        {
          brand: 'Nike',
          category: 'Running',
          discription: 'Comfortable running products with Air Max cushioning',
          quantity: 100,
          image: '',
          soldout: 10,
          unitPrice: '120.00',
        },
        {
          brand: 'Adidas',
          category: 'Casual',
          discription: 'Stylish casual sneakers',
          quantity: 50,
          image: '',
          soldout: 5,
          unitPrice: '80.00',
        },
        {
          brand: 'Puma',
          category: 'Sports',
          discription: 'High-performance sports products',
          quantity: 75,
          image: '',
          soldout: 15,
          unitPrice: '95.00',
        },
      ] as ProductInsert[])
      .returning({ id: ProductsTable.id });

    const productIds = products
      .map((product) => product.id)
      .filter((id): id is string => id !== undefined);

    // Seed ProfileTable
    type ProfileInsert = InferInsertModel<typeof ProfileTable>;
    await db.insert(ProfileTable).values([
      {
        birthDate: '1990-05-15',
        photos: [
          'https://example.com/photos/john1.jpg',
          'https://example.com/photos/john2.jpg',
        ],
        userId: userIds[0],
      },
      {
        birthDate: '1995-08-22',
        photos: ['https://example.com/photos/jane1.jpg'],
        userId: userIds[1],
      },
      {
        birthDate: '1988-03-10',
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
          orderDate: '2025-09-20',
          userId: userIds[1],
          status: 'ORDERED',
        },
        {
          orderDate: '2025-09-19',
          userId: userIds[2],
          status: 'ORDERED',
        },
      ] as OrderInsert[])
      .returning({ id: OrderTable.id });

    const orderIds = orders
      .map((order) => order.id)
      .filter((id): id is string => id !== undefined);

    // Seed OrderItemTable
    type OrderItemInsert = InferInsertModel<typeof OrderItemTable>;
    await db.insert(OrderItemTable).values([
      {
        orderId: orderIds[0],
        productId: productIds[0],
        quantity: 2,
      },
      {
        orderId: orderIds[0],
        productId: productIds[1],
        quantity: 1,
      },
      {
        orderId: orderIds[1],
        productId: productIds[2],
        quantity: 3,
      },
    ] as OrderItemInsert[]);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.end();
  }
}

seed();
