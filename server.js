const express = require('express');
const app = express();
const HTTP_PORT = 3000;
const db = require('./db');

app.use(express.static('public'));

app.get('/api/random', function (req, res) {
  db.getUsers((results) => {
    console.log(results);
  });

  res.send({
    success: true,
    message: (Math.random() * 10) + 1
  });
});


app.listen(HTTP_PORT);
console.log('Listening on port: ' + HTTP_PORT + ' -- Open http://localhost:' + HTTP_PORT);
