import type { Request, Response } from "express";
import db from "../db/index.ts"
import { OrderTable,OrderItemTable,OrderStatus,ShoesTable } from "../db/schema.ts";
import { eq, sql } from "drizzle-orm";
import type { UUID } from "crypto";

interface AuthenticatedRequest extends Request {
    user?: { name: string , id: string};
}

// Define the expected structure of an item in the request body
interface OrderItemInput {
  shoesId: string;
  quantity: number;
}

// Define the expected structure of the request body
interface CreateOrderRequestBody {
  userId: string;
  items: OrderItemInput[];
  deliveryAddress:string
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

// Helper type for the joined and aggregated result
type OrderWithItems = typeof OrderTable.$inferSelect & {
    orderItems: Array<typeof OrderItemTable.$inferSelect & {
        shoes: typeof ShoesTable.$inferSelect;
    }>;
};

export const getOrdersPaginated = async (req: Request, res: Response) => {
    try {
        const page = +(req.query.page || DEFAULT_PAGE);
        const pageSize = +(req.query.pageSize || DEFAULT_PAGE_SIZE);

        if (page < 1 || pageSize < 1) {
            return res.status(400).json({ error: "Page and pageSize must be positive numbers." });
        }

        const offset = (page - 1) * pageSize;

        // --- 1. Total Count (remains the same) ---
        const [totalCountResult] = await db
            .select({
                count: sql<number>`count(*)`
            })
            .from(OrderTable);

        const totalItems = totalCountResult?.count || 0;
        const totalPages = Math.ceil(totalItems / pageSize);

        // --- 2. Paginated Query with JOIN and Aggregation ---
        const ordersWithItemsAggregated = await db
            .select({
                // Select all fields from the OrderTable
                order: OrderTable, 
                // Aggregate order item and shoe data into a JSON array
                orderItems: sql`json_agg(
                    json_build_object(
                        'id', ${OrderItemTable.id},
                        'orderId', ${OrderItemTable.orderId},
                        'shoesId', ${OrderItemTable.shoesId},
                        'quantity', ${OrderItemTable.quantity},
                        'shoes', json_build_object(
                            'id', ${ShoesTable.id},
                            'brand', ${ShoesTable.brand},
                            'category', ${ShoesTable.category},
                            'image', ${ShoesTable.image},
                            'unitPrice', ${ShoesTable.unitPrice}
                        )
                    )
                )`.as('orderItems')
            })
            .from(OrderTable)
            .leftJoin(OrderItemTable, eq(OrderTable.id, OrderItemTable.orderId))
            .leftJoin(ShoesTable, eq(OrderItemTable.shoesId, ShoesTable.id))
            .limit(pageSize)
            .offset(offset)
            .groupBy(OrderTable.id); // Crucial: Group by the parent table's primary key

        // --- 3. Restructure the final data ---

        const finalOrders = ordersWithItemsAggregated.map(row => {
            const items = row.orderItems as any; // Cast to 'any' or define a complex type
            // Filter out the null/empty object if there were no order items (from leftJoin)
            const cleanItems = items?.[0]?.id === null ? [] : items;

            return {
                ...row.order,
                orderItems: cleanItems
            } as OrderWithItems;
        });
        // --- 4. Send Response ---
        res.status(200).json({
            data: finalOrders,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                pageSize
            }
        });
    } catch (error) {
        console.error("Get orders error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        const order = await db
            .select()
            .from(OrderTable)
            .where(eq(OrderTable.id, orderId||""))
            .then(results => results[0]);

        if (!order) {
            return res.status(404).json({ error: "Order not found." });
        }

        const orderItems = await db
            .select()
            .from(OrderItemTable)
            .where(eq(OrderItemTable.orderId, orderId||""));

        res.status(200).json({ ...order, items: orderItems });
    } catch (error) {
        console.error("Get order by ID error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        if (!Object.values(OrderStatus).includes(status)) {
            return res.status(400).json({ error: "Invalid order status." });
        }

        const result = await db
            .update(OrderTable)
            .set({ status })
            .where(eq(OrderTable.id, orderId||""))
            .returning()
            .then(results => results[0]);

        if (!result) {
            return res.status(404).json({ error: "Order not found." });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Update order status error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteOrder = async (req: Request, res: Response) => {
    // 1. Get the ID from URL parameters
        const shoeId = req.params.id; 
        // Simple validation to ensure an ID is present
        if (!shoeId) {
            return res.status(400).json({ error: "Shoe ID is required for deletion." });
        }
        try {
            // 2. Execute the Drizzle delete query
            const deletedOrders = await db
                .delete(OrderTable)
                .where(eq(OrderTable.id, shoeId)) // Assuming your primary key is named 'id'
                .returning({ id: OrderTable.id, customerName: OrderTable.userId }); 
    
            if (deletedOrders.length === 0) {
                // No row was deleted (ID not found)
                return res.status(404).json({ error: `Order with ID ${shoeId} not found.` });
            }
            
            // 3. Respond with success
            res.status(200).json({
                message: `Order with ID ${shoeId} deleted successfully.`,
                deletedItem: deletedOrders[0]
            });
    
        } catch (error) {
            console.error(`Delete order error for ID ${shoeId}:`, error);
            res.status(500).json({ error: "Internal server error during deletion." });
        }
};  



export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
    const { items,deliveryAddress } = req.body as CreateOrderRequestBody;
    const userId = req.user?.id as UUID;

    if (!userId || !items || items.length === 0) {
        return res.status(400).json({ error: "Missing required fields: userId and at least one item." });
    }
    
    try {
        // Use a Drizzle Transaction to ensure both tables are updated successfully
        const newOrder = await db.transaction(async (tx) => {
            
             // 1. Create the main Order record
            const [order] = await tx.insert(OrderTable).values(
                {
                    orderDate: new Date().toLocaleString(),
                    userId: userId,
                    status: "ORDERED",
                    deliveryAddress
                }
            ).returning();
            console.log(order)

            // Check if order creation failed
            if (!order) {
                // Rollback the transaction
                tx.rollback();
                throw new Error("Failed to create main order record.");
            }

            // 2. Prepare the Order Items for batch insertion
            const orderItemsData = items.map(item => ({
                orderId: order.id,
                shoesId: item.shoesId,
                quantity: item.quantity,
            }));

            // 3. Insert all Order Items in a batch
            await tx.insert(OrderItemTable).values(orderItemsData);

            // 4. Update Shoe Stock (Optional but crucial in e-commerce)
            for (const item of items) {
                await tx.update(ShoesTable)
                    .set({
                        quantity: sql`${ShoesTable.quantity} - ${item.quantity}`
                    })
                    .where(eq(ShoesTable.id, item.shoesId));
            }
            
            return order; // Return the successfully created order record

        });
        
        // Transaction committed successfully
        res.status(201).json({ 
            message: "Order created successfully.", 
            orderId: newOrder.id,
        });

    } catch (error) {
        // If an error occurred (e.g., shoe stock update failed, item insertion failed), 
        // the transaction is automatically rolled back.
        console.error("Create order transaction failed:", error);
        res.status(500).json({ error: "Internal server error. Order creation failed." });
    }
}