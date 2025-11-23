import express, { type Request, type Response } from 'express';
import { getProfile, updateProfile } from '../services/UserServices.ts';
import { authMiddleware } from '../midleware/authMidleware.ts';
import { uploadAvator } from '../utils/file_upload.ts';

const profileRouter = express.Router();


// app.get("/avator",);
profileRouter.get('/',authMiddleware,getProfile)
profileRouter.put('/',authMiddleware,uploadAvator.single('photos'),updateProfile)
profileRouter.delete('/',authMiddleware,(req: Request, res: Response) => {
  console.log(req.file)
  res.status(200).json({token:"ndrfknvknvskjfbvkjdbvdvhdjs jh j"})
})

export default profileRouter;