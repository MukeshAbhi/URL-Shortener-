import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Redirect-Service!');
});

app.listen(3001, () => {
  console.log('Example app listening on port 3001!');
});
