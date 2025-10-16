import express, { Request, Response } from 'express';
import { FullEvent, HLTV } from '@bogdanpet/hltv';

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello World!');
});

export default app;