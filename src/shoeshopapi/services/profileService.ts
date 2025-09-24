import type { Request, Response } from "express";
import db from "../db/index.ts";
import { ProfileTable, UsersTable } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";


interface AuthRequest extends Request {
  user?: { id: typeof uuid; role: string };
}


export const handleUserPhotoUpload = async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
try {
  const fileUrl = `${req.protocol}://${req.get('host')}/photos/${req.file.filename}`;
const userId = req.user?.id as unknown as string;
if(!userId) throw Error("User not found from session.")
     const existingProfile = await db
      .select()
      .from(ProfileTable)
      .where(eq(ProfileTable.userId, userId))
      .limit(1);

        await db
        .update(ProfileTable)
        .set({
          photos: [...(existingProfile[0]?.photos || []), fileUrl],
        })
        .where(eq(ProfileTable.userId, userId));
   res.json({ message: 'Avatar uploaded successfully', fileUrl });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to save photo to profile' });
  }
}



export const updateProfileAvator = async (req: AuthRequest, res: Response) => {
  if (!req.body.avator) {
    return res.status(400).json({ error: 'No vavator provided.' });
  }
try {
const userId = req.user?.id as unknown as string;
if(!userId) throw Error("User not found from session.")
     const existingProfile = await db
      .select()
      .from(UsersTable)
      .where(eq(UsersTable.id, userId))
      .limit(1);

        await db
        .update(UsersTable)
        .set({
          avator:req.body.avator,
        })
        .where(eq(UsersTable.id, userId));
   res.json({ message: 'Avatar changed successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to update avator.' });
  }
}