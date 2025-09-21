import express, { type Request, type Response } from 'express';
import shoeShopServer from './shoeshopapi';


const app = express();
const handleHealth = (req: Request, res: Response) => {
  res.status(200).json({success:true})
}

app.get("/api/v1/health",handleHealth)
app.use("/api/v1/shoeshopapi",shoeShopServer);

app.listen(4000, () => {
  console.log(`Server is running on port ${4000}`);
});