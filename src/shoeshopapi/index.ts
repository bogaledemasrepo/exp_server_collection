import express, { type Request, type Response } from 'express';
import authRouter from './routes/authRouter.ts';
import shoesRouter from './routes/shoesRouter.ts';


const shoeShopServer = express.Router();

shoeShopServer.use("/auth",authRouter)
shoeShopServer.use("/shoes",shoesRouter)

export default shoeShopServer;
