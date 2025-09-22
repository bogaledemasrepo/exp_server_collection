import express, { type Request, type Response } from 'express';
import { eq } from 'drizzle-orm';
import { getAllShoes } from '../services/ShoeServices.ts';

const shoesRouter = express.Router();

shoesRouter.get('/',getAllShoes);

export default shoesRouter;