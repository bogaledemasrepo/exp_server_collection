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

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export const getShoesPaginated = async (req: Request, res: Response) => {
    try {
        const page = +(req.query.page || DEFAULT_PAGE);
        const pageSize = +(req.query.pageSize || DEFAULT_PAGE_SIZE);
        const offset = (page - 1) * pageSize;
        if (page < 1 || pageSize < 1) {
            return res.status(400).json({ error: "Page and pageSize must be positive numbers." });
        }
        const [totalCountResult] = await db
            .select({
                count: sql<number>`count(*)`
            })
            .from(ShoesTable);

        const totalItems = totalCountResult?.count || 0;
        const totalPages = Math.ceil(totalItems / pageSize);
        const shoes = await db
            .select()
            .from(ShoesTable)
            .limit(pageSize)
            .offset(offset);
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
    const shoeId = req.params.id; 
    let newImagePath: string | undefined = undefined;
    if (req.file) {
      newImagePath = req.protocol + '://' + req.get('host') + "/shoes/" + req.file.filename;
    }
    const { brand, category, discription, quantity, unitPrice, soldout } = req.body;
    const fieldsToUpdate: Record<string, any> = {};

    if (brand !== undefined) fieldsToUpdate.brand = brand;
    if (category !== undefined) fieldsToUpdate.category = category;
    if (discription !== undefined) fieldsToUpdate.discription = discription;
    if (quantity !== undefined) fieldsToUpdate.quantity = quantity;
    if (unitPrice !== undefined) fieldsToUpdate.unitPrice = unitPrice;
    if (soldout !== undefined) fieldsToUpdate.soldout = soldout; // Handle updating soldout status (e.g., 0 or 1)
    if (newImagePath) fieldsToUpdate.image = newImagePath;
    
    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: "No fields provided for update." });
    }

    try {
        const resualt = await db
            .update(ShoesTable)
            .set(fieldsToUpdate)
            .where(eq(ShoesTable.id, shoeId||"")) // Assuming your primary key is named 'id'
            .returning(); 

        if (resualt.length === 0) {
            return res.status(404).json({ error: "Shoe resource not found." });
        }
        res.json(resualt[0]);

    } catch (error) {
        console.error("Update shoes error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteShoes = async (req: Request, res: Response) => {
    const shoeId = req.params.id; 
    if (!shoeId) {
        return res.status(400).json({ error: "Shoe ID is required for deletion." });
    }

    try {
        const deletedShoes = await db
            .delete(ShoesTable)
            .where(eq(ShoesTable.id, shoeId)) // Assuming your primary key is named 'id'
            .returning({ id: ShoesTable.id, brand: ShoesTable.brand }); 

        if (deletedShoes.length === 0) {
            return res.status(404).json({ error: `Shoe with ID ${shoeId} not found.` });
        }
        res.status(200).json({
            message: `Shoe with ID ${shoeId} deleted successfully.`,
            deletedItem: deletedShoes[0]
        });

    } catch (error) {
        console.error(`Delete shoe error for ID ${shoeId}:`, error);
        res.status(500).json({ error: "Internal server error during deletion." });
    }
};