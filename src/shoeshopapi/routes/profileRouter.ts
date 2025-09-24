import express, { type Request, type Response } from 'express';
import { getProfile } from '../services/UserServices.ts';
import { authMiddleware } from '../midleware/authMidleware.ts';
import { uploadAvator } from '../utils/file_upload.ts';
import { handleUserPhotoUpload, updateProfileAvator } from '../services/profileService.ts';

const profileRouter = express.Router();


// app.get("/avator",);
profileRouter.get('/me',authMiddleware,getProfile)
profileRouter.post('/me/avator',authMiddleware,updateProfileAvator)
profileRouter.post('/me/photos',authMiddleware,uploadAvator.single('photos'),handleUserPhotoUpload)
profileRouter.delete('/me/photos',authMiddleware,(req: Request, res: Response) => {
  console.log(req.file)
  res.status(200).json({token:"ndrfknvknvskjfbvkjdbvdvhdjs jh j"})
})

export default profileRouter;