import express from 'express';
import { Url, connectToDB } from '@url-shortener/db';
import { rateLimit } from '@url-shortener/rate-limiter';
import 'dotenv/config';
import { initRedis } from '@url-shortener/redis';
import { validateEnv } from './utils/envSchema.js';

const env = validateEnv();

// Initialize Redis
initRedis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

// Connect to MongoDB
await connectToDB(env.MONGO_URI);

const app = express();

app.use(async (req, res, next) => {
  const ip = req.ip;
  const key = `rate:global:${ip}`;
  const { allowed } = await rateLimit(key, 10, 10 / 60); // 10 per minute
  if (!allowed) {
    return res.status(429).json({ error: "Too many requests" });
  }
  next();
});

app.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findOne({ shortUrl });
  if (!url) {
    return res.status(404).json({ error: "Not found" });
  }
  url.clicks++;
  await url.save();
  res.redirect(url.longUrl);
});

app.listen(3001, () => {
  console.log('Redirect app listening on port 3001!');
});
