import express, { type Request, type Response } from 'express';

const authRouter = express.Router();

const handleGetMe= (req: Request, res: Response) => {
  res.status(200).json({token:"ndrfknvknvskjfbvkjdbvdvhdjs jh j"})
}

const handleLogin= (req: Request, res: Response) => {
  res.status(200).json({token:"ndrfknvknvskjfbvkjdbvdvhdjs jh j"})
}
const handleRegister= (req: Request, res: Response) => {
  res.status(200).json({token:"ndrfknvknvskjfbvkjdbvdvhdjs jh j"})
}
const handleForgetPassword= (req: Request, res: Response) => {
  res.status(200).json({token:"ndrfknvknvskjfbvkjdbvdvhdjs jh j"})
}
authRouter.get('/me',handleGetMe)
.post('/login',handleLogin)
.post('/register',handleRegister)
.post('/forget-password',handleForgetPassword)

export default authRouter;