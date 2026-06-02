import express, { type Request, type Response } from 'express';

const fastEccomerce = express.Router();

fastEccomerce.use('/', (req: Request, res: Response) => {
  res.json({
    response: 'Working!!!',
  });
});

export default fastEccomerce;
