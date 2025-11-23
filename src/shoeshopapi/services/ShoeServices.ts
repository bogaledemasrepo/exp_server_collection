import type { Request, Response } from "express";
import db from "../db/index.ts"
import { ShoesTable } from "../db/schema.ts";
import { eq, sql } from "drizzle-orm";

export const getAllShoes=async (req: Request, res: Response)=>{
    try {
     const resualt = await db.query.ShoesTable.findMany();
    if (!resualt) {
      return res.status(404).json({ error: "Resource not found." });
    }
    res.json(resualt);
  } catch (error) {
    console.error("Get shoes error error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Define default values
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export const getShoesPaginated = async (req: Request, res: Response) => {
    try {
        // 1. Get and Validate Pagination Parameters from Query String
        
        // Use unary plus (+) to convert string query parameters to numbers
        const page = +(req.query.page || DEFAULT_PAGE);
        const pageSize = +(req.query.pageSize || DEFAULT_PAGE_SIZE);

        // Calculate the starting point for the query
        const offset = (page - 1) * pageSize;
        
        // Basic sanity check for positive values
        if (page < 1 || pageSize < 1) {
            return res.status(400).json({ error: "Page and pageSize must be positive numbers." });
        }

        // 2. Fetch Total Count (To calculate total pages)
        // We need the total count of all records, regardless of pagination.
        const [totalCountResult] = await db
            .select({
                count: sql<number>`count(*)`
            })
            .from(ShoesTable);

        const totalItems = totalCountResult?.count || 0;
        const totalPages = Math.ceil(totalItems / pageSize);

        // 3. Fetch Paginated Data
        // Use .limit() and .offset() for pagination
        const shoes = await db
            .select()
            .from(ShoesTable)
            .limit(pageSize)
            .offset(offset);

        // 4. Respond with Data and Pagination Metadata
        res.status(200).json({
            data: shoes,
            metadata: {
                totalItems: totalItems,
                currentPage: page,
                pageSize: pageSize,
                totalPages: totalPages,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
            },
        });

    } catch (error) {
        console.error("Get shoes paginated error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const addShoes=async (req: Request, res: Response)=>{
    try {
      const filePath =req.protocol + '://' + req.get('host') +"/shoes/"+ (req.file?.filename || '');
      const { brand, category, discription, quantity ,unitPrice} = req.body;
      if (!brand || !category || !discription || !quantity || !unitPrice) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const resualt = await db.insert(ShoesTable).values([{
          brand,
          category,
          discription,
          quantity,
          image:filePath,
          soldout: 0,
          unitPrice,
        }]).returning(); 
      
    if (!resualt) {
      return res.status(404).json({ error: "Resource not found." });
    }
    res.json(resualt);
  } catch (error) {
    console.error("Get shoes error error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const updateShoes = async (req: Request, res: Response) => {
    // 1. Get the ID from URL parameters
    const shoeId = req.params.id; 
    
    // 2. Prepare the Image Path (Optional Update)
    let newImagePath: string | undefined = undefined;
    
    // Check if a new file was uploaded (req.file is populated by multer)
    if (req.file) {
      // Reconstruct the full path for the new image
      newImagePath = req.protocol + '://' + req.get('host') + "/shoes/" + req.file.filename;
    }

    // 3. Destructure fields from the body. These will only be used if they are defined.
    const { brand, category, discription, quantity, unitPrice, soldout } = req.body;

    // Create an object containing only the fields that were provided in the request body
    // and the image path if a new file was uploaded.
    const fieldsToUpdate: Record<string, any> = {};

    if (brand !== undefined) fieldsToUpdate.brand = brand;
    if (category !== undefined) fieldsToUpdate.category = category;
    if (discription !== undefined) fieldsToUpdate.discription = discription;
    if (quantity !== undefined) fieldsToUpdate.quantity = quantity;
    if (unitPrice !== undefined) fieldsToUpdate.unitPrice = unitPrice;
    if (soldout !== undefined) fieldsToUpdate.soldout = soldout; // Handle updating soldout status (e.g., 0 or 1)
    if (newImagePath) fieldsToUpdate.image = newImagePath;
    
    // Check if there's anything to update
    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: "No fields provided for update." });
    }

    try {
        // 4. Execute the Drizzle update query
        const resualt = await db
            .update(ShoesTable)
            .set(fieldsToUpdate)
            .where(eq(ShoesTable.id, shoeId||"")) // Assuming your primary key is named 'id'
            .returning(); 

        if (resualt.length === 0) {
            // No row was updated (ID not found)
            return res.status(404).json({ error: "Shoe resource not found." });
        }
        
        // Return the updated row
        res.json(resualt[0]);

    } catch (error) {
        console.error("Update shoes error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteShoes = async (req: Request, res: Response) => {
    // 1. Get the ID from URL parameters
    const shoeId = req.params.id; 
    
    // Simple validation to ensure an ID is present
    if (!shoeId) {
        return res.status(400).json({ error: "Shoe ID is required for deletion." });
    }

    try {
        // 2. Execute the Drizzle delete query
        // The .returning() clause is optional, but often useful to see what was deleted.
        const deletedShoes = await db
            .delete(ShoesTable)
            .where(eq(ShoesTable.id, shoeId)) // Assuming your primary key is named 'id'
            .returning({ id: ShoesTable.id, brand: ShoesTable.brand }); 

        if (deletedShoes.length === 0) {
            // No row was deleted (ID not found)
            return res.status(404).json({ error: `Shoe with ID ${shoeId} not found.` });
        }
        
        // 3. Respond with success
        res.status(200).json({
            message: `Shoe with ID ${shoeId} deleted successfully.`,
            deletedItem: deletedShoes[0]
        });

    } catch (error) {
        console.error(`Delete shoe error for ID ${shoeId}:`, error);
        res.status(500).json({ error: "Internal server error during deletion." });
    }
};