import express, { type Request, type Response } from 'express';
import { getProfile } from '../services/UserServices.ts';
import { handleLogin, handleRegister } from '../services/AuthServices.ts';
import { authMiddleware } from '../midleware/authMidleware.ts';

const authRouter = express.Router();


const handleForgetPassword= (req: Request, res: Response) => {
  res.status(200).json({token:"ndrfknvknvskjfbvkjdbvdvhdjs jh j"})
}
authRouter.get('/me',authMiddleware,getProfile)
.post('/login',handleLogin)
.post('/register',handleRegister)
.post('/forget-password',handleForgetPassword)

export default authRouter;