import type { Request, Response } from "express";
import db from "../db/index.ts";
import { UsersTable } from "../db/schema.ts";
import { eq, sql } from "drizzle-orm";

export const getPagedUsers = async (req: Request, res: Response) => {
  const DEFAULT_PAGE = 1;
  const DEFAULT_PAGE_SIZE = 10;
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
            .from(UsersTable);

        const totalItems = totalCountResult?.count || 0;
        const totalPages = Math.ceil(totalItems / pageSize);
        const users = await db
            .select()
            .from(UsersTable)
            .limit(pageSize)
            .offset(offset);
        res.status(200).json({
            data: users,
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
        console.error("Get users paginated error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getProfile = async (req: Request & { user?: { id: string; role: string } }, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const [user] = await db.select().from(UsersTable).where(eq(UsersTable.id, req.user.id));
    if(!user) throw new Error("Internl server error.")
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role,avator:user.avator });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
export const updateProfile = async (req: Request & { user?: { id: string; role: string } }, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log("Request ",req.body,req.file)

    if(req.file){
      const avatorUrl = `${req.protocol}://${req.get("host")}/photos/${req.file.filename}`;
      await db.update(UsersTable).set({ avator: avatorUrl }).where(eq(UsersTable.id, req.user.id));
    }
    const { name, email } = req.body;
    if (name) {
      await db.update(UsersTable).set({ name }).where(eq(UsersTable.id, req.user.id));
    }
    if (email) {
      await db.update(UsersTable).set({ email }).where(eq(UsersTable.id, req.user.id));
    } 
    if (!name && !email && !req.file) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const [user] = await db.select().from(UsersTable).where(eq(UsersTable.id, req.user.id));
    if(!user) throw new Error("Internl server error.")
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role,avator:user.avator });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const uploadFree = async (req: Request, res: Response) => {
  try {
    console.log("Request ",req.body,req.file)
    if(req.file) return res.json({url:`${req.protocol}://${req.get("host")}/photos/${req.file.filename}`});
    throw Error("Something went wrong!")
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

