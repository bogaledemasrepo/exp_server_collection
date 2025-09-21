import type { Request, Response } from "express";
import db from "../db/index.ts";
import { UsersTable } from "../db/schema.ts";
import { eq } from "drizzle-orm";

export const getProfile = async (req: Request & { user?: { id: string; role: string } }, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const [user] = await db.select().from(UsersTable).where(eq(UsersTable.id, req.user.id));
    if(!user) throw new Error("Internl server error.")
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}