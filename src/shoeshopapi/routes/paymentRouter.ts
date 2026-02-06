import express from 'express';
import { getCheckoutSession } from '../services/PymentService.ts';
import { authMiddleware } from '../midleware/authMidleware.ts';

const paymentRouter = express.Router();

paymentRouter.post('/create-checkout-session',express.json(),authMiddleware,getCheckoutSession)

export default paymentRouter;