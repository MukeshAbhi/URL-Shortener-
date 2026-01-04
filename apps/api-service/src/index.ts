import express from 'express';
import { rateLimit } from '@url-shortener/rate-limiter';
import { env } from '@url-shortener/config';
import { initRedis } from '@url-shortener/redis';

initRedis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

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
