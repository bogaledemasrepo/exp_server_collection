import express from 'express';
import authRouter from './routes/authRouter.ts';
import shoesRouter from './routes/shoesRouter.ts';
import profileRouter from './routes/profileRouter.ts';
import orderRouter from './routes/orderRoute.ts';
import usersRouter from './routes/usersRouter.ts';
import paymentRouter from './routes/paymentRouter.ts';

const shoeShopServer = express.Router();

shoeShopServer.use("/auth",authRouter)
shoeShopServer.use("/shoes",shoesRouter)
shoeShopServer.use("/profile",profileRouter)
shoeShopServer.use("/users",usersRouter)
shoeShopServer.use("/orders",orderRouter)
shoeShopServer.use("/payments",paymentRouter)

export default shoeShopServer;
