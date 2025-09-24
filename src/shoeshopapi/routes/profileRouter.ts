import express, { type Request, type Response } from 'express';
import { getProfile } from '../services/UserServices.ts';
import { handleLogin, handleRegister } from '../services/AuthServices.ts';
import { authMiddleware } from '../midleware/authMidleware.ts';

const profileRouter = express.Router();


const handleForgetPassword= (req: Request, res: Response) => {
  res.status(200).json({token:"ndrfknvknvskjfbvkjdbvdvhdjs jh j"})
}
profileRouter.get('/me',authMiddleware,getProfile)
.post('/me/avator',()=>{})
.delete('/me/avator',()=>{})

export default profileRouter;