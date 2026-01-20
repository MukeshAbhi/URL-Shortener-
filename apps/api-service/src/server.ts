import express from 'express';
import { rateLimit } from '@url-shortener/rate-limiter';
import 'dotenv/config';
import { initRedis } from '@url-shortener/redis';
import { validateEnv } from './utils/envSchema';

initRedis({
  url: validateEnv().UPSTASH_REDIS_REST_URL,
  token: validateEnv().UPSTASH_REDIS_REST_TOKEN,
})

const app = express();

app.use(express.json());
app.use(async (req, res, next) => {
  const ip = req.ip;
  const key = `rate:global:${ip}`;
  const { allowed } = await rateLimit(key, 10, 10 / 60); // 10 per minute
  if (!allowed) {
    return res.status(429).json({ error: "Too many requests" });
  }
  next();
});

app.get('/', (req, res) => {
  res.send('Hello From API-Service!');
});


app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
