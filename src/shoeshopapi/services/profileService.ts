   import { eq } from 'drizzle-orm';
import express, { type Request, type Response } from 'express';
import { authMiddleware } from '../midleware/authMidleware.ts';
import avatoUpload from '../utils/file_upload.ts';
import db from '../db/index.ts';
import { UsersTable } from '../db/schema.ts';
   interface AuthRequest extends Request {
     user?: { id: string; role: string };
   }

   const router = express.Router();

   // Example: Upload user avatar
   router.post('/profile/avator', authMiddleware, ()=>avatoUpload("avator"), async (req: AuthRequest, res: Response) => {
     try {
       const userId = req.user?.id;
       if (!userId) return res.status(401).json({ error: 'Unauthorized' });
       if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

       const avatarUrl = `/public/avator/${req.file.filename}`;
       await db.update(UsersTable).set({ avator: avatarUrl }).where(eq(UsersTable.id, userId));

       res.json({ message: 'Avatar uploaded successfully', avatarUrl });
     } catch (error) {
       res.status(500).json({ error: 'Failed to upload avatar' });
     }
   });

   export default router;