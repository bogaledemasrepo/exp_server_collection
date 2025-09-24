import express, { type Request, type Response } from 'express';
import authRouter from './routes/authRouter.ts';
import shoesRouter from './routes/shoesRouter.ts';
import profileRouter from './routes/profileRouter.ts';


const shoeShopServer = express.Router();

shoeShopServer.use("/auth",authRouter)
shoeShopServer.use("/shoes",shoesRouter)
shoeShopServer.use("/profile",profileRouter)

export default shoeShopServer;
