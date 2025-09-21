import express, { type Request, type Response } from 'express';
import { eq } from 'drizzle-orm';

const shoesRouter = express.Router();

shoesRouter.get('/',(req:Request,res:Request)=>{

})

export default shoesRouter;