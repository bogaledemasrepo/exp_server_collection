import express from 'express';
import { getPagedUsers } from '../services/UserServices.ts';
import { authMiddleware } from '../midleware/authMidleware.ts';

const usersRouter = express.Router(); 
usersRouter.get('/paged',authMiddleware,getPagedUsers)

export default usersRouter;