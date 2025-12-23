import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello From API-Service!');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
