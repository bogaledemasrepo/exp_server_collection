import type { Request, Response } from "express";
import db from "../db/index.ts"

export const getAllShoes=async (req: Request, res: Response)=>{
    try {
     const resualt = await db.query.ShoesTable.findMany();
    if (!resualt) {
      return res.status(404).json({ error: "Resource not found." });
    }
    res.json(resualt);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}