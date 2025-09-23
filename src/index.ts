import express, { type Request, type Response } from 'express';
import dotenv from "dotenv";
import shoeShopServer from './shoeshopapi/index.ts';
import db from "./shoeshopapi/db/index.ts";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const handleHealth = (req: Request, res: Response) => {
  res.status(200).json({success:true})
}

app.get("/health",handleHealth)
// Mount APIs
app.use("/shoeshop", shoeShopServer);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Multi-API Express Server with Bun!");
});

app.use((req: Request, res: Response) => {
  res.status(404).json({message:"Resource not found."})
})
// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});