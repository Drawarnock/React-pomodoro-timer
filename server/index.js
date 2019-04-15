const express = require('express');

const app = express();
app.use('/', (req, res) => {
  res.send('Hello World');
});

app.listen(5000, err => {
  console.log('Listening');
});