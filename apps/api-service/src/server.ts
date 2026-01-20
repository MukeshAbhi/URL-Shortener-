import express from 'express';
import cors from 'cors';
import { rateLimit } from '@url-shortener/rate-limiter';
import 'dotenv/config';
import { initRedis } from '@url-shortener/redis';
import { validateEnv } from './utils/envSchema.js';
import { getNextSequence } from './utils/counter.js';
import { encodeWithSuffix } from './utils/base62.js';
import { Url, connectToDB } from '@url-shortener/db';

const env = validateEnv();

// Initialize Redis
initRedis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

// Connect to MongoDB
await connectToDB(env.MONGO_URI);

const app = express();

// Enable CORS for all origins (adjust in production)
app.use(cors());

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

app.get('/', (_req, res) => {
  res.send('Hello From API-Service!');
});


app.post('/url', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Missing URL" });
  }
  const id = await getNextSequence("url");
  const shortUrl = encodeWithSuffix(id);
  await Url.create({ longUrl: url, shortUrl });
  res.json({ shortUrl });
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

app.listen(3000, () => {
  console.log('API app listening on port 3000!');
});
