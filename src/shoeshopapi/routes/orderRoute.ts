import express  from 'express';
import { authMiddleware } from '../midleware/authMidleware.ts';
import { createOrder, deleteOrder, getOrderById, getOrdersPaginated, updateOrder } from '../services/OrderService.ts';

const orderRouter = express.Router();

orderRouter.get('/paged',authMiddleware,getOrdersPaginated)
.post('/',express.json(),authMiddleware,createOrder)
.get('/:id',authMiddleware,getOrderById)
.put('/:id',express.json(),authMiddleware,updateOrder)
.delete('/:id',authMiddleware,deleteOrder)
export default orderRouter;