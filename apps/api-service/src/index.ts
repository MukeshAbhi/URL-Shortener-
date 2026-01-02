import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello From API-Service!');
});

app.get('ip', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ipp = req.ip;
  console.log("ip:", ip,"ipp:", ipp);
  res.send(req.ip);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
