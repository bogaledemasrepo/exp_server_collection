import type { Request, Response } from "express";
import db from "../db/index.ts"
import { OrderTable,OrderItemTable,OrderStatus,ShoesTable } from "../db/schema.ts";
import { eq, sql } from "drizzle-orm";
import type { UUID } from "crypto";

interface AuthenticatedRequest extends Request {
    user?: { name: string , id: string};
}


const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export const getOrdersPaginated = async (req: Request, res: Response) => {
    try {
        const page = +(req.query.page || DEFAULT_PAGE);
        const pageSize = +(req.query.pageSize || DEFAULT_PAGE_SIZE);

        if (page < 1 || pageSize < 1) {
            return res.status(400).json({ error: "Page and pageSize must be positive numbers." });
        }

        const offset = (page - 1) * pageSize;

        const [totalCountResult] = await db
            .select({
                count: sql<number>`count(*)`
            })
            .from(OrderTable);

        const totalItems = totalCountResult?.count || 0;
        const totalPages = Math.ceil(totalItems / pageSize);

        const orders = await db
            .select()
            .from(OrderTable)
            .limit(pageSize)
            .offset(offset);

        res.status(200).json({
            data: orders,
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
export const updateOrderStatus = async (req: Request, res: Response) => {
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
            // The .returning() clause is optional, but often useful to see what was deleted.
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


// Define the expected structure of an item in the request body
interface OrderItemInput {
  shoesId: string;
  quantity: number;
}

// Define the expected structure of the request body
interface CreateOrderRequestBody {
  userId: string;
  items: OrderItemInput[];
}

export const createOrderService = async (req: AuthenticatedRequest, res: Response) => {
    
    const { items } = req.body as CreateOrderRequestBody;
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
                    orderDate: new Date().toString(),
                    userId: userId,
                    status: "ORDERED",
                }
            ).returning();

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
                // This is a crucial step to maintain inventory integrity.
                // Subtract the ordered quantity from the stock (quantity) in ShoesTable.
                // NOTE: The exact SQL command depends on your database and Drizzle version. 
                // A common way is to use a raw SQL update or a specific Drizzle utility.
                
                // Example using Drizzle's update:
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