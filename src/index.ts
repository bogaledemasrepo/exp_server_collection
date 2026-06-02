import express, { type Request, type Response } from 'express';
import bgTelegramBotServer from './bgtelegrambotapi/index.ts';
import shoeShopServer from './shoeshopapi/index.ts';
import clothesServer from './clothesapi/index.ts';
import job from './lib/cron.ts';
import dotenv from 'dotenv';
import multer from 'multer';
import freeUpload from './freefileupload/index.ts';
import fastEccomerce from './fasteccomerceapi/index.ts';

dotenv.config();
const upload = multer();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

const handleHealth = (req: Request, res: Response) => {
  res.status(200).json({ success: true });
};

job.start();
app.get('/health', handleHealth);

// Root route
app.use('/fasteccomerceapi', fastEccomerce);
app.use('/shoeshop', shoeShopServer);
app.use('/bgtgbot', bgTelegramBotServer);
app.use('/clothes', clothesServer);
app.use('/upload', freeUpload);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found.' });
});
// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
// Start server
setInterval(
  async function () {
    const response = await fetch(process.env.SERVERURL!);
    if (response.ok) {
      console.log('Running ... on' + process.env.SERVERURL);
    }
  },
  14 * 60 * 1000
);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
