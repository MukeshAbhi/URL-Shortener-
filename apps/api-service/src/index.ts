import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import { rateLimit } from '@url-shortener/rate-limiter';

// Load .env from the root of the monorepo
dotenv.config({ path: path.resolve(__dirname, '../../..', '.env') });

const app = express();

app.get('/', (req, res) => {
  res.send('Hello From API-Service!');
});

app.get('/ip', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ipp = req.ip;
  console.log("ip:", ip,"ipp:", ipp);
  const key = `rate:create:${ip}`;
  const { allowed } = await rateLimit(key, 10, 10 / 60); // 10 per minute
  if (!allowed) {
    return res.status(429).json({ error: "Too many requests" });
  }
  res.send(req.ip);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
